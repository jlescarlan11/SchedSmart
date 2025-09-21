// utils/dateHelpers.ts

/**
 * Get the 3-letter abbreviation for a day name
 * @param day - Full day name (e.g., "Monday", "Tuesday")
 * @returns 3-letter abbreviation (e.g., "Mon", "Tue")
 */
export const getDayAbbreviation = (day: string): string => {
  return day.slice(0, 3);
};

/**
 * Get multiple day abbreviations
 * @param days - Array of full day names
 * @returns Array of 3-letter abbreviations
 */
export const getDayAbbreviations = (days: string[]): string[] => {
  return days.map(getDayAbbreviation);
};

/**
 * Format time range for display
 * @param startTime - Start time string
 * @param endTime - End time string
 * @returns Formatted time range string
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};
