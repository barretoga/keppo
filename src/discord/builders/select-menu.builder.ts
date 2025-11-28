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
  DAYS_OF_WEEK,
} from '../discord.constants';
import { EventListItem } from '../discord.types';

export class DiscordSelectMenuBuilder {
  /**
   * Creates event type selection menu
   */
  static createEventTypeSelect(): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.EVENT_TYPE)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_EVENT_TYPE)
      .addOptions(
        {
          label: 'One Time Event',
          description: 'Happens once at a specific date and time',
          value: EventType.ONE_TIME,
          emoji: '📅',
        },
        {
          label: 'Recurring Event',
          description: 'Repeats periodically (daily, weekly, etc.)',
          value: EventType.RECURRING,
          emoji: '🔁',
        },
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }

  static createEventFrequencySelect(): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.EVENT_FREQUENCY)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_FREQUENCY)
      .addOptions(
        {
          label: 'Daily',
          description: 'Repeats every day',
          value: EventFrequency.DAILY,
        },
        {
          label: 'Weekly',
          description: 'Repeats every week on a specific day',
          value: EventFrequency.WEEKLY,
        },
        {
          label: 'Monthly',
          description: 'Repeats every month on a specific day',
          value: EventFrequency.MONTHLY,
        },
        {
          label: 'Yearly',
          description: 'Repeats every year on a specific date',
          value: EventFrequency.YEARLY,
        },
        {
          label: 'Custom Cron',
          description: 'Define a custom cron expression',
          value: EventFrequency.CUSTOM,
        },
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }

  static createEventDaySelect(): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.EVENT_DAY)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_DAY)
      .addOptions(DAYS_OF_WEEK);

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

  /**
   * Creates manga selection menu (from search results)
   */
  static createMangaSelect(
    results: any[], // TODO: Use proper type MangaSearchResult
  ): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.MANGA_SELECT)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_MANGA)
      .addOptions(
        results.map((manga) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(manga.title.slice(0, 100))
            .setDescription(`Score: ${manga.mean || 'N/A'} | Chapters: ${manga.chapters || '?'}`)
            .setValue(manga.id.toString()),
        ),
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }

  /**
   * Creates manga unsubscribe selection menu
   */
  static createMangaUnsubscribeSelect(
    subscriptions: any[], // TODO: Use proper type MangaSubscription
  ): ActionRowBuilder<StringSelectMenuBuilder> {
    const select = new StringSelectMenuBuilder()
      .setCustomId(SELECT_MENU_IDS.MANGA_UNSUBSCRIBE)
      .setPlaceholder(MESSAGES.PROMPT.SELECT_UNSUBSCRIBE)
      .addOptions(
        subscriptions.map((sub) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(sub.title.slice(0, 100))
            .setDescription(`Last Chapter: ${sub.lastChapter > 0 ? sub.lastChapter : 'Unknown/Ongoing'}`)
            .setValue(sub.id.toString()),
        ),
      );

    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  }
}
