/**
 * Select Menu Handler
 * Handles Discord select menu interactions
 */

import { Injectable, Logger } from '@nestjs/common';
import { StringSelectMenuInteraction } from 'discord.js';
import { EventsService } from '../../events/events.service';
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

  constructor(private readonly eventsService: EventsService) {}

  /**
   * Main select menu handler dispatcher
   */
  async handle(interaction: StringSelectMenuInteraction): Promise<void> {
    const { customId } = interaction;

    try {
      switch (customId) {
        case SELECT_MENU_IDS.CREATE_EVENT_TYPE:
          await this.handleEventTypeSelection(interaction);
          break;
        case SELECT_MENU_IDS.CREATE_EVENT_FREQUENCY:
          await this.handleEventFrequencySelection(interaction);
          break;
        case SELECT_MENU_IDS.DELETE_EVENT:
          await this.handleEventDeletion(interaction);
          break;
        default:
          this.logger.warn(`Unknown select menu: ${customId}`);
      }
    } catch (error) {
      this.logger.error(`Error handling select menu ${customId}:`, error);
      
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
   * Handle event type selection (ONE_TIME vs RECURRING)
   */
  private async handleEventTypeSelection(
    interaction: StringSelectMenuInteraction,
  ): Promise<void> {
    const selection = interaction.values[0] as EventType;

    if (selection === EventType.ONE_TIME) {
      const modal = DiscordModalBuilder.createOneTimeEventModal();
      await interaction.showModal(modal);
    } else if (selection === EventType.RECURRING) {
      const row = DiscordSelectMenuBuilder.createEventFrequencySelectMenu();
      await interaction.update({
        content: MESSAGES.PROMPT.SELECT_FREQUENCY,
        components: [row],
      });
    }
  }

  /**
   * Handle event frequency selection (DAILY, WEEKLY, CUSTOM)
   */
  private async handleEventFrequencySelection(
    interaction: StringSelectMenuInteraction,
  ): Promise<void> {
    const selection = interaction.values[0] as EventFrequency;

    let modal;

    switch (selection) {
      case EventFrequency.DAILY:
        modal = DiscordModalBuilder.createDailyEventModal();
        break;
      case EventFrequency.WEEKLY:
        modal = DiscordModalBuilder.createWeeklyEventModal();
        break;
      case EventFrequency.CUSTOM:
        modal = DiscordModalBuilder.createCustomRecurringEventModal();
        break;
      default:
        this.logger.warn(`Unknown frequency: ${selection}`);
        return;
    }

    await interaction.showModal(modal);
  }

  /**
   * Handle event deletion selection
   */
  private async handleEventDeletion(
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
