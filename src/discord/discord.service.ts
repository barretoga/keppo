/**
 * Discord Service
 * Main service for Discord bot integration
 */

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  Client,
  GatewayIntentBits,
  TextChannel,
  REST,
  Routes,
  SlashCommandBuilder,
  Interaction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { EventsService } from '../events/events.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommandHandler } from './handlers/command.handler';
import { ModalHandler } from './handlers/modal.handler';
import { SelectMenuHandler } from './handlers/select-menu.handler';
import { COMMANDS, SUBCOMMANDS, MESSAGES } from './discord.constants';
import { NotificationEventData } from './discord.types';
import {
  ChannelNotFoundException,
  DiscordClientNotReadyException,
} from './exceptions/discord.exceptions';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(DiscordService.name);
  
  // Handlers
  private commandHandler: CommandHandler;
  private modalHandler: ModalHandler;
  private selectMenuHandler: SelectMenuHandler;

  // Cache for guild configurations
  private guildConfigCache = new Map<string, string>();

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly eventsService: EventsService,
    private readonly prisma: PrismaService,
  ) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    // Initialize handlers
    this.commandHandler = new CommandHandler(
      this.authService,
      this.eventsService,
      this.prisma,
    );
    this.modalHandler = new ModalHandler(this.authService, this.eventsService);
    this.selectMenuHandler = new SelectMenuHandler(this.eventsService);
  }

  /**
   * Module initialization
   */
  async onModuleInit(): Promise<void> {
    const token = this.configService.get<string>('DISCORD_TOKEN');
    const clientId = this.configService.get<string>('DISCORD_CLIENT_ID');

    if (!token || !clientId) {
      this.logger.warn('DISCORD_TOKEN or DISCORD_CLIENT_ID not found');
      return;
    }

    this.setupEventHandlers();

    try {
      await this.client.login(token);
      this.logger.log('Discord Bot logged in successfully');
      await this.registerCommands(token, clientId);
      await this.loadGuildConfigs();
    } catch (error) {
      this.logger.error('Failed to login to Discord', error);
    }
  }

  /**
   * Setup Discord event handlers
   */
  private setupEventHandlers(): void {
    this.client.on('interactionCreate', async (interaction: Interaction) => {
      try {
        if (interaction.isChatInputCommand()) {
          await this.handleCommandInteraction(interaction);
        } else if (interaction.isModalSubmit()) {
          await this.handleModalInteraction(interaction);
        } else if (interaction.isStringSelectMenu()) {
          await this.handleSelectMenuInteraction(interaction);
        }
      } catch (error) {
        this.logger.error('Interaction error:', error);
        await this.handleInteractionError(interaction, error);
      }
    });

    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}`);
    });

    this.client.on('error', (error) => {
      this.logger.error('Discord client error:', error);
    });
  }

  /**
   * Handle command interactions
   */
  private async handleCommandInteraction(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    await this.commandHandler.handle(interaction);
  }

  /**
   * Handle modal interactions
   */
  private async handleModalInteraction(
    interaction: ModalSubmitInteraction,
  ): Promise<void> {
    await this.modalHandler.handle(interaction);
  }

  /**
   * Handle select menu interactions
   */
  private async handleSelectMenuInteraction(
    interaction: StringSelectMenuInteraction,
  ): Promise<void> {
    await this.selectMenuHandler.handle(interaction);
  }

  /**
   * Handle interaction errors
   */
  private async handleInteractionError(
    interaction: Interaction,
    error: Error,
  ): Promise<void> {
    const errorMessage = error.message || MESSAGES.ERROR.GENERIC_ERROR;

    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({
          content: errorMessage,
          ephemeral: true,
        });
      } catch (replyError) {
        this.logger.error('Failed to send error reply:', replyError);
      }
    }
  }

  /**
   * Register slash commands with Discord
   */
  async registerCommands(token: string, clientId: string): Promise<void> {
    const commands = [
      new SlashCommandBuilder()
        .setName(COMMANDS.REGISTER)
        .setDescription('Create a new account'),
      new SlashCommandBuilder()
        .setName(COMMANDS.LOGIN)
        .setDescription('Link your Discord account'),
      new SlashCommandBuilder()
        .setName(COMMANDS.SETUP)
        .setDescription('Set the current channel for notifications'),
      new SlashCommandBuilder()
        .setName(COMMANDS.EVENT)
        .setDescription('Manage events')
        .addSubcommand((sub) =>
          sub.setName(SUBCOMMANDS.CREATE).setDescription('Create a new event'),
        )
        .addSubcommand((sub) =>
          sub.setName(SUBCOMMANDS.LIST).setDescription('List your events'),
        )
        .addSubcommand((sub) =>
          sub.setName(SUBCOMMANDS.DELETE).setDescription('Delete an event'),
        ),
    ];

    const rest = new REST({ version: '10' }).setToken(token);

    try {
      this.logger.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      this.logger.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      this.logger.error('Failed to reload application (/) commands.', error);
    }
  }

  /**
   * Load guild configurations into cache
   */
  private async loadGuildConfigs(): Promise<void> {
    try {
      const configs = await this.prisma.guildConfig.findMany();
      configs.forEach((config) => {
        this.guildConfigCache.set(config.guildId, config.defaultChannelId);
      });
      this.logger.log(`Loaded ${configs.length} guild configurations`);
    } catch (error) {
      this.logger.error('Failed to load guild configurations:', error);
    }
  }

  /**
   * Get channel ID for event notification
   */
  private async getNotificationChannelId(
    event: NotificationEventData,
  ): Promise<string | null> {
    // Priority 1: Event-specific channel
    if (event.channelId) {
      return event.channelId;
    }

    // Priority 2: Environment variable
    const envChannelId = this.configService.get<string>('DISCORD_CHANNEL_ID');
    if (envChannelId) {
      return envChannelId;
    }

    // Priority 3: First available guild config
    const config = await this.prisma.guildConfig.findFirst();
    if (config) {
      return config.defaultChannelId;
    }

    return null;
  }

  /**
   * Send event notification to Discord channel
   */
  async notifyEvent(event: NotificationEventData): Promise<void> {
    if (!this.client.isReady()) {
      this.logger.warn(MESSAGES.ERROR.CLIENT_NOT_READY);
      throw new DiscordClientNotReadyException();
    }

    const channelId = await this.getNotificationChannelId(event);

    if (!channelId) {
      this.logger.warn(MESSAGES.ERROR.NO_CHANNEL_CONFIGURED);
      return;
    }

    try {
      const channel = await this.client.channels.fetch(channelId);

      if (!channel || !(channel instanceof TextChannel)) {
        this.logger.error(MESSAGES.ERROR.CHANNEL_NOT_FOUND(channelId));
        throw new ChannelNotFoundException(channelId);
      }

      const message = MESSAGES.NOTIFICATION.EVENT_TRIGGERED(
        event.title,
        event.description,
      );

      await channel.send(message);
      this.logger.log(`Notification sent to channel ${channel.name} (${channelId})`);
    } catch (error) {
      this.logger.error(`Failed to send notification to channel ${channelId}:`, error);
      throw error;
    }
  }

  /**
   * Get Discord client (for testing purposes)
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Check if client is ready
   */
  isReady(): boolean {
    return this.client.isReady();
  }
}
