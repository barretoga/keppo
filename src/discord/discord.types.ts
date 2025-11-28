/**
 * Discord Service Type Definitions
 * TypeScript interfaces and types for Discord bot interactions
 */

import { CommandInteraction, ModalSubmitInteraction, StringSelectMenuInteraction } from 'discord.js';

// Event Data Types
export interface CreateEventData {
  title: string;
  description?: string;
  type: 'ONE_TIME' | 'RECURRING';
  date?: Date;
  cron?: string;
  userId: number;
  channelId: string;
}

export interface EventModalFields {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  day?: string;
  cron?: string;
}

// Authentication Data
export interface AuthModalFields {
  email: string;
  password: string;
}

// User Context
export interface UserContext {
  id: number;
  email: string;
  discordId: string;
}

// Event List Item
export interface EventListItem {
  id: number;
  title: string;
  type: string;
  userId: number;
}

// Interaction Type Guards
export type DiscordCommandInteraction = CommandInteraction;
export type DiscordModalInteraction = ModalSubmitInteraction;
export type DiscordSelectMenuInteraction = StringSelectMenuInteraction;

// Cron Time Components
export interface CronTimeComponents {
  minutes: string;
  hours: string;
  dayOfMonth?: string;
  month?: string;
  dayOfWeek?: string;
}

// Guild Configuration
export interface GuildConfigData {
  guildId: string;
  defaultChannelId: string;
}

// Notification Event Data
export interface NotificationEventData {
  id: number;
  title: string;
  description?: string;
  channelId?: string;
  type: string;
  cron?: string;
  user?: {
    email: string;
    discordId?: string;
  };
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Time Validation
export interface TimeValidation extends ValidationResult {
  hours?: number;
  minutes?: number;
}

// Date Validation
export interface DateValidation extends ValidationResult {
  date?: Date;
}

// Cron Validation
export interface CronValidation extends ValidationResult {
  cron?: string;
}

// Day of Week Validation
export interface DayValidation extends ValidationResult {
  dayNumber?: number;
  dayName?: string;
}
