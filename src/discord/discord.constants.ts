/**
 * Discord Service Constants
 * Centralized constants for Discord bot interactions
 */

// Custom IDs for Modals
export const MODAL_IDS = {
  REGISTER: 'registerModal',
  LOGIN: 'loginModal',
  CREATE_EVENT_ONE_TIME: 'createEventOneTimeModal',
  CREATE_EVENT_DAILY: 'createEventDailyModal',
  CREATE_EVENT_WEEKLY: 'createEventWeeklyModal',
  CREATE_EVENT_RECURRING: 'createEventRecurringModal',
} as const;

// Custom IDs for Select Menus
export const SELECT_MENU_IDS = {
  CREATE_EVENT_TYPE: 'createEventTypeSelect',
  CREATE_EVENT_FREQUENCY: 'createEventFrequencySelect',
  DELETE_EVENT: 'deleteEventSelect',
} as const;

// Modal Field IDs
export const FIELD_IDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
  TITLE: 'title',
  DESCRIPTION: 'description',
  DATE: 'date',
  TIME: 'time',
  DAY: 'day',
  CRON: 'cron',
} as const;

// Event Types
export enum EventType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING',
}

// Event Frequencies
export enum EventFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  CUSTOM = 'CUSTOM',
}

// Days of Week Mapping
export const DAYS_OF_WEEK: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const;

// Messages
export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    REGISTER: 'Registered successfully! Now please /login to link your Discord.',
    LOGIN: 'Logged in and linked successfully!',
    CHANNEL_SETUP: (channelId: string) => `Channel <#${channelId}> configured as default for notifications.`,
    EVENT_CREATED_ONE_TIME: 'One-time event created successfully!',
    EVENT_CREATED_DAILY: (time: string) => `Daily event created! Schedule: ${time}`,
    EVENT_CREATED_WEEKLY: (day: string, time: string) => `Weekly event created! Every ${day} at ${time}`,
    EVENT_CREATED_RECURRING: 'Recurring event created successfully!',
    EVENT_DELETED: (eventId: number) => `Event ${eventId} deleted.`,
  },
  
  // Error Messages
  ERROR: {
    REGISTER_FAILED: 'Registration failed. Email might be taken.',
    LOGIN_FAILED: 'Login failed. Invalid credentials.',
    SETUP_FAILED: 'Failed to save configuration.',
    NOT_AUTHENTICATED: 'Please /login first.',
    NO_EVENTS: 'No events found.',
    NO_EVENTS_TO_DELETE: 'No events to delete.',
    EVENT_CREATE_FAILED: 'Failed to create event. Check date format (YYYY-MM-DD HH:mm).',
    EVENT_CREATE_FAILED_TIME: 'Failed to create event. Check time format (HH:mm).',
    EVENT_CREATE_FAILED_DAY: 'Failed. Check day (e.g., Monday) and time (HH:mm).',
    EVENT_CREATE_FAILED_CRON: 'Failed to create event. Check cron format.',
    EVENT_DELETE_FAILED: 'Failed to delete event.',
    GUILD_ONLY: 'This command can only be used in a server.',
    GENERIC_ERROR: 'An error occurred.',
    CLIENT_NOT_READY: 'Discord client not ready, skipping notification',
    CHANNEL_NOT_FOUND: (channelId: string) => `Channel with ID ${channelId} not found`,
    NO_CHANNEL_CONFIGURED: 'No DISCORD_CHANNEL_ID configured for this event',
  },
  
  // Prompts
  PROMPT: {
    SELECT_EVENT_TYPE: 'What type of event is this?',
    SELECT_FREQUENCY: 'How often should it repeat?',
    SELECT_EVENT_TO_DELETE: 'Choose an event to delete:',
    YOUR_EVENTS: 'Your events:',
  },
  
  // Labels
  LABEL: {
    EVENT_TYPE_ONE_TIME: 'One Time Event',
    EVENT_TYPE_RECURRING: 'Recurring Event',
    FREQUENCY_DAILY: 'Daily',
    FREQUENCY_WEEKLY: 'Weekly',
    FREQUENCY_CUSTOM: 'Custom',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    EVENT_TITLE: 'Event Title',
    DESCRIPTION: 'Description',
    DATE: 'Date (YYYY-MM-DD HH:mm)',
    TIME: 'Time (HH:mm)',
    DAY_OF_WEEK: 'Day of Week',
    CRON_EXPRESSION: 'Cron Expression',
  },
  
  // Descriptions
  DESCRIPTION: {
    EVENT_TYPE_ONE_TIME: 'Happens once at a specific date and time',
    EVENT_TYPE_RECURRING: 'Repeats based on a schedule (Cron)',
    FREQUENCY_DAILY: 'Every day at a specific time',
    FREQUENCY_WEEKLY: 'Every week on a specific day',
    FREQUENCY_CUSTOM: 'Advanced (Cron Expression)',
    EVENT_ID: (id: number) => `ID: ${id}`,
  },
  
  // Placeholders
  PLACEHOLDER: {
    DATE: '2025-12-31 23:59',
    TIME: '14:30',
    TIME_MORNING: '09:00',
    DAY: 'Monday',
    CRON: '* * * * *',
  },
  
  // Notification
  NOTIFICATION: {
    EVENT_TRIGGERED: (title: string, description?: string) => 
      `**EVENT TRIGGERED**: ${title}\n${description || ''}`,
  },
} as const;

// Command Names
export const COMMANDS = {
  REGISTER: 'register',
  LOGIN: 'login',
  SETUP: 'setup',
  EVENT: 'event',
} as const;

// Subcommands
export const SUBCOMMANDS = {
  CREATE: 'create',
  LIST: 'list',
  DELETE: 'delete',
} as const;

// Modal Titles
export const MODAL_TITLES = {
  REGISTER: 'Register',
  LOGIN: 'Login',
  CREATE_ONE_TIME_EVENT: 'Create One-Time Event',
  CREATE_DAILY_EVENT: 'Create Daily Event',
  CREATE_WEEKLY_EVENT: 'Create Weekly Event',
  CREATE_CUSTOM_EVENT: 'Create Custom Recurring Event',
} as const;
