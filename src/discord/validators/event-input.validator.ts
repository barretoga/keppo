/**
 * Event Input Validators
 * Validation functions for event creation inputs
 */

import {
  DateValidation,
  TimeValidation,
  DayValidation,
  CronValidation,
} from '../discord.types';
import { DAYS_OF_WEEK } from '../discord.constants';

/**
 * Validates a date string in format YYYY-MM-DD HH:mm
 */
export function validateDate(dateStr: string): DateValidation {
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: 'Invalid date format. Expected: YYYY-MM-DD HH:mm',
      };
    }
    
    // Check if date is in the past
    if (date < new Date()) {
      return {
        isValid: false,
        error: 'Date cannot be in the past',
      };
    }
    
    return {
      isValid: true,
      date,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to parse date',
    };
  }
}

/**
 * Validates a time string in format HH:mm
 */
export function validateTime(timeStr: string): TimeValidation {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  const match = timeStr.match(timeRegex);
  
  if (!match) {
    return {
      isValid: false,
      error: 'Invalid time format. Expected: HH:mm (e.g., 14:30)',
    };
  }
  
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return {
      isValid: false,
      error: 'Invalid time values',
    };
  }
  
  return {
    isValid: true,
    hours,
    minutes,
  };
}

/**
 * Validates a day of week string
 */
export function validateDayOfWeek(dayStr: string): DayValidation {
  const normalizedDay = dayStr.toLowerCase().trim();
  
  if (!(normalizedDay in DAYS_OF_WEEK)) {
    return {
      isValid: false,
      error: 'Invalid day of week. Expected: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday',
    };
  }
  
  return {
    isValid: true,
    dayNumber: DAYS_OF_WEEK[normalizedDay],
    dayName: normalizedDay,
  };
}

/**
 * Validates a cron expression (basic validation)
 */
export function validateCronExpression(cronStr: string): CronValidation {
  // Basic cron validation: should have 5 parts (minute hour day month weekday)
  const cronParts = cronStr.trim().split(/\s+/);
  
  if (cronParts.length !== 5) {
    return {
      isValid: false,
      error: 'Invalid cron expression. Expected 5 parts: minute hour day month weekday',
    };
  }
  
  // Validate each part contains valid characters
  const validCronChars = /^[\d\*\-\,\/]+$/;
  
  for (const part of cronParts) {
    if (!validCronChars.test(part)) {
      return {
        isValid: false,
        error: 'Invalid characters in cron expression',
      };
    }
  }
  
  return {
    isValid: true,
    cron: cronStr,
  };
}

/**
 * Creates a cron expression from time components
 */
export function createCronExpression(
  minutes: number,
  hours: number,
  dayOfWeek?: number,
): string {
  if (dayOfWeek !== undefined) {
    // Weekly cron
    return `${minutes} ${hours} * * ${dayOfWeek}`;
  }
  
  // Daily cron
  return `${minutes} ${hours} * * *`;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength (basic)
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long',
    };
  }
  
  return { isValid: true };
}
