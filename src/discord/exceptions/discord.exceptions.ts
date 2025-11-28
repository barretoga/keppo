/**
 * Custom Discord Exceptions
 * Specific exceptions for Discord bot error handling
 */

import { HttpException, HttpStatus } from '@nestjs/common';

export class DiscordException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
  }
}

export class UserNotAuthenticatedException extends DiscordException {
  constructor() {
    super('User not authenticated. Please login first.', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidDateFormatException extends DiscordException {
  constructor(providedDate: string) {
    super(
      `Invalid date format: "${providedDate}". Expected format: YYYY-MM-DD HH:mm`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidTimeFormatException extends DiscordException {
  constructor(providedTime: string) {
    super(
      `Invalid time format: "${providedTime}". Expected format: HH:mm`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidDayOfWeekException extends DiscordException {
  constructor(providedDay: string) {
    super(
      `Invalid day of week: "${providedDay}". Expected: Monday, Tuesday, etc.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidCronExpressionException extends DiscordException {
  constructor(providedCron: string) {
    super(
      `Invalid cron expression: "${providedCron}"`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EventNotFoundException extends DiscordException {
  constructor(eventId: number) {
    super(`Event with ID ${eventId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class EventCreationFailedException extends DiscordException {
  constructor(reason?: string) {
    super(
      `Failed to create event${reason ? `: ${reason}` : ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class EventDeletionFailedException extends DiscordException {
  constructor(eventId: number) {
    super(
      `Failed to delete event with ID ${eventId}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ChannelNotFoundException extends DiscordException {
  constructor(channelId: string) {
    super(`Channel with ID ${channelId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class GuildOnlyCommandException extends DiscordException {
  constructor() {
    super('This command can only be used in a server', HttpStatus.FORBIDDEN);
  }
}

export class DiscordClientNotReadyException extends DiscordException {
  constructor() {
    super('Discord client is not ready', HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class RegistrationFailedException extends DiscordException {
  constructor(reason?: string) {
    super(
      `Registration failed${reason ? `: ${reason}` : '. Email might be taken.'}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class LoginFailedException extends DiscordException {
  constructor() {
    super('Login failed. Invalid credentials.', HttpStatus.UNAUTHORIZED);
  }
}

export class GuildConfigurationFailedException extends DiscordException {
  constructor() {
    super('Failed to save guild configuration', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
