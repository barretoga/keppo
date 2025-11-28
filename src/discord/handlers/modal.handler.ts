/**
 * Modal Handler
 * Handles Discord modal submission interactions
 */

import { Injectable, Logger } from '@nestjs/common';
import { ModalSubmitInteraction } from 'discord.js';
import { AuthService } from '../../auth/auth.service';
import { EventsService } from '../../events/events.service';
import { MalService } from '../../mal/mal.service';
import { DiscordSelectMenuBuilder } from '../builders/select-menu.builder';
import {
  MODAL_IDS,
  FIELD_IDS,
  MESSAGES,
  EventType,
} from '../discord.constants';
import {
  validateDate,
  validateTime,
  validateDayOfWeek,
  validateCronExpression,
  createCronExpression,
} from '../validators/event-input.validator';
import {
  RegistrationFailedException,
  LoginFailedException,
  InvalidDateFormatException,
  InvalidTimeFormatException,
  InvalidDayOfWeekException,
  InvalidCronExpressionException,
  EventCreationFailedException,
  UserNotAuthenticatedException,
  UserAlreadyExistsException,
} from '../exceptions/discord.exceptions';

@Injectable()
export class ModalHandler {
  private readonly logger = new Logger(ModalHandler.name);

  constructor(
    private readonly authService: AuthService,
    private readonly eventsService: EventsService,
    private readonly malService: MalService, // Injected MalService
  ) {}

  /**
   * Main modal handler dispatcher
   */
  async handle(interaction: ModalSubmitInteraction): Promise<void> {
    const { customId } = interaction;

    try {
      switch (customId) {
        case MODAL_IDS.REGISTER:
          await this.handleRegister(interaction);
          break;
        case MODAL_IDS.LOGIN:
          await this.handleLogin(interaction);
          break;
        case MODAL_IDS.CREATE_EVENT_ONE_TIME:
          await this.handleCreateOneTimeEvent(interaction);
          break;
        case MODAL_IDS.CREATE_EVENT_DAILY:
          await this.handleCreateDailyEvent(interaction);
          break;
        case MODAL_IDS.CREATE_EVENT_WEEKLY:
          await this.handleCreateWeeklyEvent(interaction);
          break;
        case MODAL_IDS.CREATE_EVENT_RECURRING:
          await this.handleCreateRecurringEvent(interaction);
          break;
        case MODAL_IDS.MANGA_SEARCH:
          await this.handleMangaSearch(interaction);
          break;
        default:
          this.logger.warn(`Unknown modal: ${customId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling modal ${customId}:`, error);
      
      const errorMessage = error.message || MESSAGES.ERROR.GENERIC_ERROR;
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: errorMessage,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: errorMessage,
          ephemeral: true,
        });
      }
    }
  }

  /**
   * Handle registration modal submission
   */
  private async handleRegister(interaction: ModalSubmitInteraction): Promise<void> {
    const email = interaction.fields.getTextInputValue(FIELD_IDS.EMAIL);
    const password = interaction.fields.getTextInputValue(FIELD_IDS.PASSWORD);
    const name = interaction.fields.getTextInputValue(FIELD_IDS.NAME);
    const phoneNumber = interaction.fields.getTextInputValue(FIELD_IDS.PHONE);

    try {
      await this.authService.register(email, password, name, phoneNumber);
      await interaction.reply({
        content: MESSAGES.SUCCESS.REGISTER,
        ephemeral: true,
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        await interaction.reply({
          content: MESSAGES.ERROR.USER_ALREADY_EXISTS || 'User with this email already exists.',
          ephemeral: true,
        });
        return;
      }
      this.logger.error('Registration failed:', error);
      throw new RegistrationFailedException(error.message);
    }
  }

  /**
   * Handle login modal submission
   */
  private async handleLogin(interaction: ModalSubmitInteraction): Promise<void> {
    const email = interaction.fields.getTextInputValue(FIELD_IDS.EMAIL);
    const password = interaction.fields.getTextInputValue(FIELD_IDS.PASSWORD);

    try {
      await this.authService.linkDiscord(email, password, interaction.user.id);
      await interaction.reply({
        content: MESSAGES.SUCCESS.LOGIN,
        ephemeral: true,
      });
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw new LoginFailedException();
    }
  }

  /**
   * Handle one-time event creation modal
   */
  private async handleCreateOneTimeEvent(
    interaction: ModalSubmitInteraction,
  ): Promise<void> {
    const user = await this.authService.findByDiscordId(interaction.user.id);
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const title = interaction.fields.getTextInputValue(FIELD_IDS.TITLE);
    const description = interaction.fields.getTextInputValue(FIELD_IDS.DESCRIPTION);
    const dateStr = interaction.fields.getTextInputValue(FIELD_IDS.DATE);

    // Validate date
    const dateValidation = validateDate(dateStr);
    if (!dateValidation.isValid) {
      throw new InvalidDateFormatException(dateStr);
    }

    try {
      await this.eventsService.create({
        title,
        description: description || undefined,
        type: EventType.ONE_TIME,
        date: dateValidation.date,
        userId: user.id,
        channelId: interaction.channelId,
      });

      await interaction.reply({
        content: MESSAGES.SUCCESS.EVENT_CREATED_ONE_TIME,
        ephemeral: true,
      });
    } catch (error) {
      this.logger.error('Failed to create one-time event:', error);
      throw new EventCreationFailedException(error.message);
    }
  }

  /**
   * Handle daily event creation modal
   */
  private async handleCreateDailyEvent(
    interaction: ModalSubmitInteraction,
  ): Promise<void> {
    const user = await this.authService.findByDiscordId(interaction.user.id);
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const title = interaction.fields.getTextInputValue(FIELD_IDS.TITLE);
    const description = interaction.fields.getTextInputValue(FIELD_IDS.DESCRIPTION);
    const timeStr = interaction.fields.getTextInputValue(FIELD_IDS.TIME);

    // Validate time
    const timeValidation = validateTime(timeStr);
    if (!timeValidation.isValid) {
      throw new InvalidTimeFormatException(timeStr);
    }

    const cron = createCronExpression(
      timeValidation.minutes!,
      timeValidation.hours!,
    );

    try {
      await this.eventsService.create({
        title,
        description: description || undefined,
        type: EventType.RECURRING,
        cron,
        userId: user.id,
        channelId: interaction.channelId,
      });

      await interaction.reply({
        content: MESSAGES.SUCCESS.EVENT_CREATED_DAILY(timeStr),
        ephemeral: true,
      });
    } catch (error) {
      this.logger.error('Failed to create daily event:', error);
      throw new EventCreationFailedException(error.message);
    }
  }

  /**
   * Handle weekly event creation modal
   */
  private async handleCreateWeeklyEvent(
    interaction: ModalSubmitInteraction,
  ): Promise<void> {
    const user = await this.authService.findByDiscordId(interaction.user.id);
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const title = interaction.fields.getTextInputValue(FIELD_IDS.TITLE);
    const description = interaction.fields.getTextInputValue(FIELD_IDS.DESCRIPTION);
    const dayStr = interaction.fields.getTextInputValue(FIELD_IDS.DAY);
    const timeStr = interaction.fields.getTextInputValue(FIELD_IDS.TIME);

    // Validate day
    const dayValidation = validateDayOfWeek(dayStr);
    if (!dayValidation.isValid) {
      throw new InvalidDayOfWeekException(dayStr);
    }

    // Validate time
    const timeValidation = validateTime(timeStr);
    if (!timeValidation.isValid) {
      throw new InvalidTimeFormatException(timeStr);
    }

    const cron = createCronExpression(
      timeValidation.minutes!,
      timeValidation.hours!,
      dayValidation.dayNumber!,
    );

    try {
      await this.eventsService.create({
        title,
        description: description || undefined,
        type: EventType.RECURRING,
        cron,
        userId: user.id,
        channelId: interaction.channelId,
      });

      await interaction.reply({
        content: MESSAGES.SUCCESS.EVENT_CREATED_WEEKLY(
          dayValidation.dayName!,
          timeStr,
        ),
        ephemeral: true,
      });
    } catch (error) {
      this.logger.error('Failed to create weekly event:', error);
      throw new EventCreationFailedException(error.message);
    }
  }

  /**
   * Handle custom recurring event creation modal
   */
  private async handleCreateRecurringEvent(
    interaction: ModalSubmitInteraction,
  ): Promise<void> {
    const user = await this.authService.findByDiscordId(interaction.user.id);
    if (!user) {
      throw new UserNotAuthenticatedException();
    }

    const title = interaction.fields.getTextInputValue(FIELD_IDS.TITLE);
    const description = interaction.fields.getTextInputValue(FIELD_IDS.DESCRIPTION);
    const cronStr = interaction.fields.getTextInputValue(FIELD_IDS.CRON);

    // Validate cron
    const cronValidation = validateCronExpression(cronStr);
    if (!cronValidation.isValid) {
      throw new InvalidCronExpressionException(cronStr);
    }

    try {
      await this.eventsService.create({
        title,
        description: description || undefined,
        type: EventType.RECURRING,
        cron: cronValidation.cron,
        userId: user.id,
        channelId: interaction.channelId,
      });

      await interaction.reply({
        content: MESSAGES.SUCCESS.EVENT_CREATED_RECURRING,
        ephemeral: true,
      });
    } catch (error) {
      this.logger.error('Failed to create recurring event:', error);
      throw new EventCreationFailedException(error.message);
    }
  }

  /**
   * Handle manga search modal submission
   */
  async handleMangaSearch(interaction: ModalSubmitInteraction): Promise<void> {
    const query = interaction.fields.getTextInputValue(FIELD_IDS.SEARCH_QUERY);

    try {
      await interaction.deferReply({ ephemeral: true });
      const results = await this.malService.searchManga(query);

      if (results.length === 0) {
        await interaction.editReply({
          content: MESSAGES.ERROR.NO_MANGA_FOUND,
        });
        return;
      }

      const row = DiscordSelectMenuBuilder.createMangaSelect(results);

      await interaction.editReply({
        content: MESSAGES.PROMPT.SELECT_MANGA,
        components: [row],
      });
    } catch (error) {
      this.logger.error('Manga search failed:', error);
      throw error;
    }
  }
}
