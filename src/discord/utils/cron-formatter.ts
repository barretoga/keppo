/**
 * Cron Expression Formatter
 * Utility functions to convert cron expressions into human-readable text
 */

/**
 * Format a cron expression into human-readable text
 * @param cron - Cron expression (5 fields: minute hour day month dayOfWeek)
 * @returns Human-readable description
 */
export function formatCronExpression(cron: string): string {
  if (!cron) return 'Unknown schedule';

  const parts = cron.trim().split(/\s+/);
  
  // Validate cron has 5 parts
  if (parts.length !== 5) {
    return `Custom schedule: ${cron}`;
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Every minute
  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return 'Every minute';
  }

  // Every X minutes
  if (minute.startsWith('*/') && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const interval = minute.substring(2);
    return `Every ${interval} minutes`;
  }

  // Every hour (at minute X)
  if (minute !== '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return `Every hour at minute ${minute.padStart(2, '0')}`;
  }

  // Every X hours
  if (minute !== '*' && hour.startsWith('*/') && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const interval = hour.substring(2);
    const time = minute.padStart(2, '0');
    return `Every ${interval} hours at :${time}`;
  }

  // Daily at specific time
  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    return `Daily at ${time}`;
  }

  // Weekly on specific day
  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
    const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    const day = getDayName(dayOfWeek);
    return `Weekly on ${day} at ${time}`;
  }

  // Monthly on specific day
  if (minute !== '*' && hour !== '*' && dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
    const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    return `Monthly on day ${dayOfMonth} at ${time}`;
  }

  // Yearly on specific date
  if (minute !== '*' && hour !== '*' && dayOfMonth !== '*' && month !== '*' && dayOfWeek === '*') {
    const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    const monthName = getMonthName(month);
    return `Yearly on ${monthName} ${dayOfMonth} at ${time}`;
  }

  // Default: show the cron expression
  return `Custom schedule: ${cron}`;
}

/**
 * Get day name from cron day of week value
 */
function getDayName(dayOfWeek: string): string {
  const days: Record<string, string> = {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
    '7': 'Sunday',
  };
  return days[dayOfWeek] || `day ${dayOfWeek}`;
}

/**
 * Get month name from cron month value
 */
function getMonthName(month: string): string {
  const months: Record<string, string> = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  };
  return months[month] || `month ${month}`;
}
