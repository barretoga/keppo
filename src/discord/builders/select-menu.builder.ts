/**
 * Select Menu Builder
 * Reusable builder for creating Discord select menus
 */

import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} from 'discord.js';
import {
  SELECT_MENU_IDS,
  MESSAGES,
  EventType,
  EventFrequency,
} from '../discord.constants';
import { EventListItem } from '../discord.types';

export class DiscordSelectMenuBuilder {
  /**
   * Creates event type selection menu
   */
  static createEventTypeSelectMenu(): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.CREATE_EVENT_TYPE)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_EVENT_TYPE)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(MESSAGES.LABEL.EVENT_TYPE_ONE_TIME)
          .setDescription(MESSAGES.DESCRIPTION.EVENT_TYPE_ONE_TIME)
          .setValue(EventType.ONE_TIME),
        new StringSelectMenuOptionBuilder()
          .setLabel(MESSAGES.LABEL.EVENT_TYPE_RECURRING)
          .setDescription(MESSAGES.DESCRIPTION.EVENT_TYPE_RECURRING)
          .setValue(EventType.RECURRING),
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }

  /**
   * Creates event frequency selection menu
   */
  static createEventFrequencySelectMenu(): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.CREATE_EVENT_FREQUENCY)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_FREQUENCY)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(MESSAGES.LABEL.FREQUENCY_DAILY)
          .setDescription(MESSAGES.DESCRIPTION.FREQUENCY_DAILY)
          .setValue(EventFrequency.DAILY),
        new StringSelectMenuOptionBuilder()
          .setLabel(MESSAGES.LABEL.FREQUENCY_WEEKLY)
          .setDescription(MESSAGES.DESCRIPTION.FREQUENCY_WEEKLY)
          .setValue(EventFrequency.WEEKLY),
        new StringSelectMenuOptionBuilder()
          .setLabel(MESSAGES.LABEL.FREQUENCY_CUSTOM)
          .setDescription(MESSAGES.DESCRIPTION.FREQUENCY_CUSTOM)
          .setValue(EventFrequency.CUSTOM),
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }

  /**
   * Creates event deletion selection menu
   */
  static createEventDeletionSelectMenu(
    events: EventListItem[],
  ): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.DELETE_EVENT)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_EVENT_TO_DELETE)
      .addOptions(
        events.map((event) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(event.title)
            .setDescription(MESSAGES.DESCRIPTION.EVENT_ID(event.id))
            .setValue(event.id.toString()),
        ),
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }
}
