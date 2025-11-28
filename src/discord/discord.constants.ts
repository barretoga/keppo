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
  MANGA_SEARCH: 'mangaSearchModal',
} as const;

// Custom IDs for Select Menus
export const SELECT_MENU_IDS = {
  EVENT_TYPE: 'eventTypeSelect',
  EVENT_FREQUENCY: 'eventFrequencySelect',
  EVENT_DAY: 'eventDaySelect',
  MANGA_SELECT: 'mangaSelect',
  MANGA_UNSUBSCRIBE: 'mangaUnsubscribeSelect',
  DELETE_EVENT: 'deleteEventSelect',
} as const;

// Modal Field IDs
export const FIELD_IDS = {
  TITLE: 'titleInput',
  DESCRIPTION: 'descriptionInput',
  SEARCH_QUERY: 'searchQueryInput',
  EMAIL: 'email',
  PASSWORD: 'password',
  NAME: 'name',
  PHONE: 'phone',
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
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

// Days of Week Mapping
export const DAYS_OF_WEEK = [
  { label: 'Sunday', value: '0' },
  { label: 'Monday', value: '1' },
  { label: 'Tuesday', value: '2' },
  { label: 'Wednesday', value: '3' },
  { label: 'Thursday', value: '4' },
  { label: 'Friday', value: '5' },
  { label: 'Saturday', value: '6' },
];

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
    EVENT_CREATED: 'Event created successfully!',
    SUBSCRIPTION_CREATED: (title: string) => `Successfully subscribed to **${title}**! You will be notified when new chapters are released.`,
    UNSUBSCRIBED: (title: string) => `Successfully unsubscribed from **${title}**.`,
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
    COMMAND_NOT_FOUND: 'Command not found.',
    MODAL_NOT_FOUND: 'Modal handler not found.',
    SELECT_MENU_NOT_FOUND: 'Select menu handler not found.',
    INVALID_CRON: 'Invalid cron expression.',
    NO_MANGA_FOUND: 'No manga found with that name.',
    ALREADY_SUBSCRIBED: 'You are already subscribed to this manga.',
    SUBSCRIPTION_FAILED: 'Failed to subscribe to manga.',
    NO_SUBSCRIPTIONS: 'You have no active manga subscriptions.',
    USER_ALREADY_EXISTS: 'User with this email already exists.',
  },
  
  // Prompts
  PROMPT: {
    SELECT_EVENT_TYPE: 'Select the type of event you want to create:',
    SELECT_FREQUENCY: 'Select how often the event should repeat:',
    SELECT_DAY: 'Select the day of the week:',
    ENTER_CRON: 'Please enter a cron expression (e.g., "* * * * *"):',
    SELECT_MANGA: 'Select a manga to subscribe to:',
    SELECT_UNSUBSCRIBE: 'Select a manga to unsubscribe from:',
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
    NAME: 'Name',
    PHONE: 'Phone (WhatsApp)',
    EVENT_TITLE: 'Event Title',
    DESCRIPTION: 'Description',
    DATE: 'Date (YYYY-MM-DD HH:mm)',
    TIME: 'Time (HH:mm)',
    DAY_OF_WEEK: 'Day of Week',
    CRON_EXPRESSION: 'Cron Expression',
    SEARCH: 'Search Manga',
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
    SEARCH: 'Enter manga name (e.g., One Piece)',
  },
  
  // Notification
  NOTIFICATION: {
    EVENT_TRIGGERED: (title: string, description?: string) => 
      `**EVENT TRIGGERED**: ${title}\n${description || ''}`,
    NEW_CHAPTER: (title: string, chapter: number, cover?: string) => 
      `**NEW CHAPTER RELEASED!**\n\n**${title}**\nChapter ${chapter} is now available!`,
  },
} as const;

export const MODAL_TITLES = {
  REGISTER: 'Register',
  LOGIN: 'Login',
  CREATE_ONE_TIME_EVENT: 'Create One-Time Event',
  CREATE_DAILY_EVENT: 'Create Daily Event',
  CREATE_WEEKLY_EVENT: 'Create Weekly Event',
  CREATE_CUSTOM_EVENT: 'Create Custom Recurring Event',
  SEARCH_MANGA: 'Search Manga',
} as const;

// Command Names
export const COMMANDS = {
  REGISTER: 'register',
  LOGIN: 'login',
  SETUP: 'setup',
  EVENT: 'event',
  MANGA: 'manga',
} as const;

// Subcommands
export const SUBCOMMANDS = {
  CREATE: 'create',
  LIST: 'list',
  DELETE: 'delete',
} as const;

export const MANGA_SUBCOMMANDS = {
  SEARCH: 'search',
  LIST: 'list',
  UNSUBSCRIBE: 'unsubscribe',
} as const;
