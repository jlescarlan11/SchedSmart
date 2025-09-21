// utils/scheduler.ts - FIXED VERSION with correct imports

import { ScheduleSlot, GeneratedSchedule } from "../types/scheduler";
import { SCHEDULE_FILENAME } from "../constants/scheduler";
// Import the algorithms
import { generateSchedule as generateScheduleAlgo } from "@/algorithms/scheduler";

/**
 * Converts 12-hour time format to 24-hour decimal format
 * @param time12h - Time in 12-hour format (e.g., "2:30 PM")
 * @returns Time as decimal hours (e.g., 14.5)
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

/**
 * Checks if two schedule slots have time conflicts
 * @param slot1 - First schedule slot
 * @param slot2 - Second schedule slot
 * @returns True if there's a conflict, false otherwise
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

/**
 * Downloads the generated schedule as a JSON file
 * @param schedule - Generated schedule to download
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

/**
 * Validates time slot data
 * @param startTime - Start time string
 * @param endTime - End time string
 * @returns True if valid, false otherwise
 */
export const isValidTimeSlot = (
  startTime: string,
  endTime: string
): boolean => {
  if (!startTime || !endTime) return false;

  const startHour = convertTo24Hour(startTime);
  const endHour = convertTo24Hour(endTime);

  return endHour > startHour;
};

// Re-export the main schedule generation function
export const generateSchedule = generateScheduleAlgo;
