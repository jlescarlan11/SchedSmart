// utils/index.ts - Consolidated utility functions

import { ScheduleSlot, GeneratedSchedule } from "../types/scheduler";
import { SCHEDULE_FILENAME } from "../constants/scheduler";

// ============================================================================
// DATE AND TIME UTILITIES
// ============================================================================

/**
 * Get the 3-letter abbreviation for a day name
 */
export const getDayAbbreviation = (day: string): string => day.slice(0, 3);

/**
 * Get multiple day abbreviations
 */
export const getDayAbbreviations = (days: string[]): string[] => 
  days.map(getDayAbbreviation);

/**
 * Format time range for display
 */
export const formatTimeRange = (startTime: string, endTime: string): string => 
  `${startTime} - ${endTime}`;

/**
 * Format a slot (days and time range) for display
 */
export const formatSlot = (slot: {
  days: string[];
  startTime: string;
  endTime: string;
}): string => 
  `${slot.days.join(", ")} ${formatTimeRange(slot.startTime, slot.endTime)}`;

/**
 * Converts 12-hour time format to 24-hour decimal format
 */
export const convertTo24Hour = (time12h: string): number => {
  const [time, modifier] = time12h.split(" ");
  const [hoursStr, minutesStr] = time.split(":");

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (hours === 12) {
    hours = modifier === "AM" ? 0 : 12;
  } else if (modifier === "PM") {
    hours += 12;
  }

  return hours + minutes / 60;
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates time slot data
 */
export const isValidTimeSlot = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;
  
  const startHour = convertTo24Hour(startTime);
  const endHour = convertTo24Hour(endTime);
  
  return endHour > startHour;
};

/**
 * Checks if two schedule slots have time conflicts
 */
export const checkTimeConflict = (
  slot1: ScheduleSlot,
  slot2: ScheduleSlot
): boolean => {
  // Check if there's any day overlap
  const dayOverlap = slot1.days.some((day) => slot2.days.includes(day));
  if (!dayOverlap) return false;

  // Check time overlap
  const start1 = convertTo24Hour(slot1.startTime);
  const end1 = convertTo24Hour(slot1.endTime);
  const start2 = convertTo24Hour(slot2.startTime);
  const end2 = convertTo24Hour(slot2.endTime);

  return start1 < end2 && start2 < end1;
};

// ============================================================================
// FILE UTILITIES
// ============================================================================

/**
 * Downloads the generated schedule as a JSON file
 */
export const downloadScheduleJSON = (schedule: GeneratedSchedule): void => {
  try {
    const blob = new Blob([JSON.stringify(schedule, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = SCHEDULE_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading schedule:", error);
  }
};

// ============================================================================
// DOM UTILITIES
// ============================================================================

/**
 * Smooth scroll to a section by ID
 */
export const smoothScrollToSection = (sectionId: string): void => {
  const scrollToElement = (element: HTMLElement) => {
    const offsetTop = element.offsetTop - 128; // Account for fixed header height
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  };

  const element = document.getElementById(sectionId);
  if (element) {
    scrollToElement(element);
  } else {
    // Retry after a short delay if element doesn't exist yet
    setTimeout(() => {
      const retryElement = document.getElementById(sectionId);
      if (retryElement) {
        scrollToElement(retryElement);
      }
    }, 100);
  }
};
