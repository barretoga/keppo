/**
 * Modal Builder
 * Reusable builder for creating Discord modals
 */

import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import {
  MODAL_IDS,
  MODAL_TITLES,
  FIELD_IDS,
  MESSAGES,
} from '../discord.constants';

export class DiscordModalBuilder {
  /**
   * Creates a registration modal
   */
  static createRegistrationModal(): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(MODAL_IDS.REGISTER)
      .setTitle(MODAL_TITLES.REGISTER);

    const emailInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.EMAIL)
      .setLabel(MESSAGES.LABEL.EMAIL)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const passwordInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.PASSWORD)
      .setLabel(MESSAGES.LABEL.PASSWORD)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(emailInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(passwordInput),
    );

    return modal;
  }

  /**
   * Creates a login modal
   */
  static createLoginModal(): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(MODAL_IDS.LOGIN)
      .setTitle(MODAL_TITLES.LOGIN);

    const emailInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.EMAIL)
      .setLabel(MESSAGES.LABEL.EMAIL)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const passwordInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.PASSWORD)
      .setLabel(MESSAGES.LABEL.PASSWORD)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(emailInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(passwordInput),
    );

    return modal;
  }

  /**
   * Creates a one-time event creation modal
   */
  static createOneTimeEventModal(): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(MODAL_IDS.CREATE_EVENT_ONE_TIME)
      .setTitle(MODAL_TITLES.CREATE_ONE_TIME_EVENT);

    const titleInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.TITLE)
      .setLabel(MESSAGES.LABEL.EVENT_TITLE)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.DESCRIPTION)
      .setLabel(MESSAGES.LABEL.DESCRIPTION)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const dateInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.DATE)
      .setLabel(MESSAGES.LABEL.DATE)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(MESSAGES.PLACEHOLDER.DATE)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput),
    );

    return modal;
  }

  /**
   * Creates a daily event creation modal
   */
  static createDailyEventModal(): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(MODAL_IDS.CREATE_EVENT_DAILY)
      .setTitle(MODAL_TITLES.CREATE_DAILY_EVENT);

    const titleInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.TITLE)
      .setLabel(MESSAGES.LABEL.EVENT_TITLE)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.DESCRIPTION)
      .setLabel(MESSAGES.LABEL.DESCRIPTION)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const timeInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.TIME)
      .setLabel(MESSAGES.LABEL.TIME)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(MESSAGES.PLACEHOLDER.TIME)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput),
    );

    return modal;
  }

  /**
   * Creates a weekly event creation modal
   */
  static createWeeklyEventModal(): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(MODAL_IDS.CREATE_EVENT_WEEKLY)
      .setTitle(MODAL_TITLES.CREATE_WEEKLY_EVENT);

    const titleInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.TITLE)
      .setLabel(MESSAGES.LABEL.EVENT_TITLE)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.DESCRIPTION)
      .setLabel(MESSAGES.LABEL.DESCRIPTION)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const dayInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.DAY)
      .setLabel(MESSAGES.LABEL.DAY_OF_WEEK)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(MESSAGES.PLACEHOLDER.DAY)
      .setRequired(true);

    const timeInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.TIME)
      .setLabel(MESSAGES.LABEL.TIME)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(MESSAGES.PLACEHOLDER.TIME_MORNING)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(dayInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput),
    );

    return modal;
  }

  /**
   * Creates a custom recurring event creation modal
   */
  static createCustomRecurringEventModal(): ModalBuilder {
    const modal = new ModalBuilder()
      .setCustomId(MODAL_IDS.CREATE_EVENT_RECURRING)
      .setTitle(MODAL_TITLES.CREATE_CUSTOM_EVENT);

    const titleInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.TITLE)
      .setLabel(MESSAGES.LABEL.EVENT_TITLE)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.DESCRIPTION)
      .setLabel(MESSAGES.LABEL.DESCRIPTION)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const cronInput = new TextInputBuilder()
      .setCustomId(FIELD_IDS.CRON)
      .setLabel(MESSAGES.LABEL.CRON_EXPRESSION)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(MESSAGES.PLACEHOLDER.CRON)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(cronInput),
    );

    return modal;
  }
}
