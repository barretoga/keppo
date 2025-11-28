/**
 * Select Menu Handler
 * Handles Discord select menu interactions
 */

import { Injectable, Logger } from '@nestjs/common';
import { StringSelectMenuInteraction } from 'discord.js';
import { EventsService } from '../../events/events.service';
import { MangaService } from '../../manga/manga.service';
import { AuthService } from '../../auth/auth.service';
import { DiscordModalBuilder } from '../builders/modal.builder';
import { DiscordSelectMenuBuilder } from '../builders/select-menu.builder';
import {
  SELECT_MENU_IDS,
  EventType,
  EventFrequency,
  MESSAGES,
} from '../discord.constants';
import { EventDeletionFailedException } from '../exceptions/discord.exceptions';

@Injectable()
export class SelectMenuHandler {
  private readonly logger = new Logger(SelectMenuHandler.name);

  constructor(
    private readonly eventsService: EventsService,
    private readonly mangaService: MangaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Main select menu handler dispatcher
   */
  async handle(interaction: StringSelectMenuInteraction): Promise<void> {
    const { customId } = interaction;

    try {
      switch (interaction.customId) {
        case SELECT_MENU_IDS.EVENT_TYPE:
          await this.handleEventTypeSelect(interaction);
          break;
        case SELECT_MENU_IDS.EVENT_FREQUENCY:
          await this.handleEventFrequencySelect(interaction);
          break;
        case SELECT_MENU_IDS.EVENT_DAY:
          await this.handleEventDaySelect(interaction);
          break;
        case SELECT_MENU_IDS.MANGA_SELECT:
          await this.handleMangaSelect(interaction);
          break;
        case SELECT_MENU_IDS.MANGA_UNSUBSCRIBE:
          await this.handleMangaUnsubscribe(interaction);
          break;
        case SELECT_MENU_IDS.DELETE_EVENT:
          await this.handleDeleteEventSelect(interaction);
          break;
        default:
          this.logger.warn(`Unknown select menu: ${customId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling select menu ${customId}:`, error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: MESSAGES.ERROR.GENERIC_ERROR,
          ephemeral: true,
        });
      }
    }
  }

  /**
   * Handle event type selection (ONE_TIME vs RECURRING)
   */
  async handleEventTypeSelect(interaction: StringSelectMenuInteraction) {
    const selectedType = interaction.values[0];
    
    // If recurring, show frequency select
    if (selectedType === EventType.RECURRING) {
      const row = DiscordSelectMenuBuilder.createEventFrequencySelect();
      await interaction.reply({
        content: MESSAGES.PROMPT.SELECT_FREQUENCY,
        components: [row],
        ephemeral: true,
      });
    } else {
      // If one time, show date input modal (or whatever next step is)
      // For now, let's just show the modal
      const modal = DiscordModalBuilder.createOneTimeEventModal();
      await interaction.showModal(modal);
    }
  }

  async handleEventFrequencySelect(interaction: StringSelectMenuInteraction) {
    const selectedFrequency = interaction.values[0];

    if (selectedFrequency === EventFrequency.WEEKLY) {
      const row = DiscordSelectMenuBuilder.createEventDaySelect();
      await interaction.reply({
        content: MESSAGES.PROMPT.SELECT_DAY,
        components: [row],
        ephemeral: true,
      });
    } else if (selectedFrequency === EventFrequency.CUSTOM) {
      const modal = DiscordModalBuilder.createCustomRecurringEventModal();
      await interaction.showModal(modal);
    } else if (selectedFrequency === EventFrequency.DAILY) {
      const modal = DiscordModalBuilder.createDailyEventModal();
      await interaction.showModal(modal);
    } else {
      // Default fallback (should be handled better but for now...)
      const modal = DiscordModalBuilder.createOneTimeEventModal();
      await interaction.showModal(modal);
    }
  }

  async handleEventDaySelect(interaction: StringSelectMenuInteraction) {
    // For weekly events, after selecting day, show weekly modal
    // We might need to pass the day, but for now let's just show the modal
    // and let user confirm day/time
    const modal = DiscordModalBuilder.createWeeklyEventModal();
    await interaction.showModal(modal);
  }

  /**
   * Handle manga selection (Subscribe)
   */
  async handleMangaSelect(interaction: StringSelectMenuInteraction) {
    const malId = parseInt(interaction.values[0]);
    
    await interaction.deferReply({ ephemeral: true });
    
    try {
      const user = await this.authService.validateDiscordUser(interaction.user.id);
      if (!user) {
        await interaction.editReply({ content: MESSAGES.ERROR.NOT_AUTHENTICATED });
        return;
      }

      const subscription = await this.mangaService.createSubscription(
        interaction.user.id,
        malId,
        interaction.channelId,
      );

      await interaction.editReply({
        content: MESSAGES.SUCCESS.SUBSCRIPTION_CREATED(subscription.title),
      });
    } catch (error) {
      this.logger.error(`Error subscribing to manga: ${error.message}`, error.stack);
      
      if (error.message.includes('already subscribed')) {
        await interaction.editReply({ content: MESSAGES.ERROR.ALREADY_SUBSCRIBED });
      } else {
        await interaction.editReply({ content: MESSAGES.ERROR.SUBSCRIPTION_FAILED });
      }
    }
  }

  /**
   * Handle manga unsubscribe selection
   */
  async handleMangaUnsubscribe(interaction: StringSelectMenuInteraction) {
    const subscriptionId = parseInt(interaction.values[0]);
    
    await interaction.deferReply({ ephemeral: true });
    
    try {
      const user = await this.authService.validateDiscordUser(interaction.user.id);
      if (!user) {
        await interaction.editReply({ content: MESSAGES.ERROR.NOT_AUTHENTICATED });
        return;
      }

      const subscription = await this.mangaService.getSubscriptionById(subscriptionId);
      if (!subscription) {
        await interaction.editReply({ content: 'Subscription not found.' });
        return;
      }

      await this.mangaService.deleteSubscription(subscriptionId, user.id);
      
      await interaction.editReply({
        content: MESSAGES.SUCCESS.UNSUBSCRIBED(subscription.title),
      });
    } catch (error) {
      this.logger.error(`Error unsubscribing from manga: ${error.message}`, error.stack);
      await interaction.editReply({ content: MESSAGES.ERROR.GENERIC_ERROR });
    }
  }

  /**
   * Handle event deletion selection
   */
  private async handleDeleteEventSelect(
    interaction: StringSelectMenuInteraction,
  ): Promise<void> {
    const eventId = parseInt(interaction.values[0], 10);

    try {
      await this.eventsService.remove(eventId);
      await interaction.update({
        content: MESSAGES.SUCCESS.EVENT_DELETED(eventId),
        components: [],
      });
    } catch (error) {
      this.logger.error(`Failed to delete event ${eventId}:`, error);
      throw new EventDeletionFailedException(eventId);
    }
  }
}
