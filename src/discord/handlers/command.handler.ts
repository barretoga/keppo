/**
 * Command Handler
 * Handles Discord slash command interactions
 */

import { Injectable, Logger } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { AuthService } from '../../auth/auth.service';
import { EventsService } from '../../events/events.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MangaService } from '../../manga/manga.service';
import { DiscordModalBuilder } from '../builders/modal.builder';
import { DiscordSelectMenuBuilder } from '../builders/select-menu.builder';
import {
  COMMANDS,
  SUBCOMMANDS,
  MANGA_SUBCOMMANDS,
  MESSAGES,
} from '../discord.constants';
import { EventListItem } from '../discord.types';
import {
  GuildOnlyCommandException,
  UserNotAuthenticatedException,
  GuildConfigurationFailedException,
} from '../exceptions/discord.exceptions';

@Injectable()
export class CommandHandler {
  private readonly logger = new Logger(CommandHandler.name);

  constructor(
    private readonly authService: AuthService,
    private readonly eventsService: EventsService,
    private readonly prisma: PrismaService,
    private readonly mangaService: MangaService,
  ) {}

  /**
   * Main command handler dispatcher
   */
  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const { commandName } = interaction;

    try {
      if (commandName === COMMANDS.REGISTER) {
        await this.handleRegister(interaction);
      } else if (commandName === COMMANDS.LOGIN) {
        await this.handleLogin(interaction);
      } else if (commandName === COMMANDS.SETUP) {
        await this.handleSetup(interaction);
      } else if (commandName === COMMANDS.EVENT) {
        await this.handleEvent(interaction);
      } else if (commandName === COMMANDS.MANGA) {
        await this.handleManga(interaction);
      } else {
        this.logger.warn(`Unknown command: ${commandName}`);
        await interaction.reply({
          content: MESSAGES.ERROR.COMMAND_NOT_FOUND,
          ephemeral: true,
        });
      }
    } catch (error) {
      this.logger.error(`Error handling command ${commandName}:`, error);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: error.message || MESSAGES.ERROR.GENERIC_ERROR,
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: error.message || MESSAGES.ERROR.GENERIC_ERROR,
          ephemeral: true,
        });
      }
    }
  }

  /**
   * Handle /register command
   */
  private async handleRegister(interaction: ChatInputCommandInteraction): Promise<void> {
    const modal = DiscordModalBuilder.createRegistrationModal();
    await interaction.showModal(modal);
  }

  /**
   * Handle /login command
   */
  private async handleLogin(interaction: ChatInputCommandInteraction): Promise<void> {
    const modal = DiscordModalBuilder.createLoginModal();
    await interaction.showModal(modal);
  }

  /**
   * Handle /setup command
   */
  private async handleSetup(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) {
      throw new GuildOnlyCommandException();
    }

    try {
      await this.prisma.guildConfig.upsert({
        where: { guildId: interaction.guildId },
        update: { defaultChannelId: interaction.channelId },
        create: {
          guildId: interaction.guildId,
          defaultChannelId: interaction.channelId,
        },
      });

      await interaction.reply({
        content: MESSAGES.SUCCESS.CHANNEL_SETUP(interaction.channelId),
        ephemeral: true,
      });
    } catch (error) {
      this.logger.error('Failed to setup channel:', error);
      throw new GuildConfigurationFailedException();
    }
  }

  /**
   * Handle /event command with subcommands
   */
  private async handleEvent(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case SUBCOMMANDS.CREATE:
        await this.handleEventCreate(interaction);
        break;
      case SUBCOMMANDS.LIST:
        await this.handleEventList(interaction);
        break;
      case SUBCOMMANDS.DELETE:
        await this.handleEventDelete(interaction);
        break;
      default:
        this.logger.warn(`Unknown event subcommand: ${subcommand}`);
    }
  }

  /**
   * Handle /event create subcommand
   */
  private async handleEventCreate(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = await this.authService.findByDiscordId(interaction.user.id);
    
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const row = DiscordSelectMenuBuilder.createEventTypeSelect();
    await interaction.reply({
      content: MESSAGES.PROMPT.SELECT_EVENT_TYPE,
      components: [row],
      ephemeral: true,
    });
  }

  /**
   * Handle /event list subcommand
   */
  private async handleEventList(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = await this.authService.findByDiscordId(interaction.user.id);
    
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const events = await this.eventsService.findAll();
    const userEvents = events.filter((e) => e.userId === user.id);

    if (userEvents.length === 0) {
      await interaction.reply({
        content: MESSAGES.ERROR.NO_EVENTS,
        ephemeral: true,
      });
      return;
    }

    const list = userEvents
      .map((e) => `- [${e.id}] ${e.title} (${e.type})`)
      .join('\n');

    await interaction.reply({
      content: `${MESSAGES.PROMPT.YOUR_EVENTS}\n${list}`,
      ephemeral: true,
    });
  }

  /**
   * Handle /event delete subcommand
   */
  private async handleEventDelete(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = await this.authService.findByDiscordId(interaction.user.id);
    
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const events = await this.eventsService.findAll();
    const userEvents = events.filter((e) => e.userId === user.id);

    if (userEvents.length === 0) {
      await interaction.reply({
        content: MESSAGES.ERROR.NO_EVENTS_TO_DELETE,
        ephemeral: true,
      });
      return;
    }

    // Filter out events with null userId for type safety
    const validEvents = userEvents.filter((e) => e.userId !== null) as Array<EventListItem>;
    const row = DiscordSelectMenuBuilder.createEventDeletionSelectMenu(validEvents);
    await interaction.reply({
      content: MESSAGES.PROMPT.SELECT_EVENT_TO_DELETE,
      components: [row],
      ephemeral: true,
    });
  }

  /**
   * Handle /manga command
   */
  private async handleManga(interaction: ChatInputCommandInteraction) {
    const user = await this.authService.validateDiscordUser(interaction.user.id);
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === MANGA_SUBCOMMANDS.SEARCH) {
      const modal = DiscordModalBuilder.createMangaSearchModal();
      await interaction.showModal(modal);
    } else if (subcommand === MANGA_SUBCOMMANDS.LIST) {
      await this.handleMangaList(interaction, user.id);
    } else if (subcommand === MANGA_SUBCOMMANDS.UNSUBSCRIBE) {
      await this.handleMangaUnsubscribe(interaction, user.id);
    }
  }

  /**
   * Handle manga list command
   */
  private async handleMangaList(interaction: ChatInputCommandInteraction, userId: number) {
    await interaction.deferReply({ ephemeral: true });
    
    const subscriptions = await this.mangaService.getUserSubscriptions(userId);

    if (subscriptions.length === 0) {
      await interaction.editReply({ content: MESSAGES.ERROR.NO_SUBSCRIPTIONS });
      return;
    }

    const list = subscriptions
      .map((sub) => `• **${sub.title}** (Last Chapter: ${sub.lastChapter > 0 ? sub.lastChapter : 'Unknown/Ongoing'})`)
      .join('\n');

    await interaction.editReply({
      content: `${MESSAGES.PROMPT.YOUR_EVENTS}\n\n${list}`,
    });
  }

  /**
   * Handle manga unsubscribe command
   */
  private async handleMangaUnsubscribe(interaction: ChatInputCommandInteraction, userId: number) {
    await interaction.deferReply({ ephemeral: true });

    const subscriptions = await this.mangaService.getUserSubscriptions(userId);

    if (subscriptions.length === 0) {
      await interaction.editReply({ content: MESSAGES.ERROR.NO_SUBSCRIPTIONS });
      return;
    }

    const row = DiscordSelectMenuBuilder.createMangaUnsubscribeSelect(subscriptions);

    await interaction.editReply({
      content: MESSAGES.PROMPT.SELECT_UNSUBSCRIBE,
      components: [row],
    });
  }
}
