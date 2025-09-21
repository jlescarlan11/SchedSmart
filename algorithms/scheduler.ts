// algorithms/scheduler.ts

import { Course, GeneratedSchedule, ScheduleSlot } from "../types/scheduler";
import { checkTimeConflict } from "../utils/scheduler";
import { BACKTRACKING_COURSE_LIMIT } from "../constants/scheduler";

/**
 * Generates schedule using backtracking algorithm for optimal results
 * @param courses - Array of courses with available time slots
 * @returns Generated schedule with optimal course placement
 */
export const generateScheduleBacktracking = (
  courses: Course[]
): GeneratedSchedule => {
  let bestSchedule: ScheduleSlot[] = [];
  let bestCount = 0;

  const backtrack = (
    courseIndex: number,
    currentSchedule: ScheduleSlot[]
  ): void => {
    // Base case: processed all courses
    if (courseIndex === courses.length) {
      if (currentSchedule.length > bestCount) {
        bestCount = currentSchedule.length;
        bestSchedule = [...currentSchedule];
      }
      return;
    }

    const course = courses[courseIndex];

    // Try each available slot for this course
    for (
      let slotIndex = 0;
      slotIndex < course.availableSlots.length;
      slotIndex++
    ) {
      const slot = course.availableSlots[slotIndex];
      const potentialSlot: ScheduleSlot = {
        courseCode: course.courseCode,
        days: slot.days,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotIndex: slotIndex,
      };

      // Check if this slot conflicts with any in current schedule
      const hasConflict = currentSchedule.some((existingSlot) =>
        checkTimeConflict(potentialSlot, existingSlot)
      );

      if (!hasConflict) {
        // Add this slot and recurse
        currentSchedule.push(potentialSlot);
        backtrack(courseIndex + 1, currentSchedule);
        currentSchedule.pop(); // Backtrack
      }
    }

    // Also try skipping this course (explore not scheduling it)
    backtrack(courseIndex + 1, currentSchedule);
  };

  // Start backtracking
  backtrack(0, []);

  // Generate conflicts list
  const scheduledCourses = new Set(bestSchedule.map((slot) => slot.courseCode));
  const conflicts = courses
    .filter((course) => !scheduledCourses.has(course.courseCode))
    .map(
      (course) => `Could not schedule ${course.courseCode} in optimal solution`
    );

  return {
    schedule: bestSchedule,
    conflicts,
    totalCourses: courses.length,
    scheduledCourses: bestSchedule.length,
    algorithm: "backtracking",
    generatedAt: new Date().toISOString(),
  };
};

/**
 * Generates schedule using greedy algorithm for faster results
 * @param courses - Array of courses with available time slots
 * @returns Generated schedule using greedy approach
 */
export const generateScheduleGreedy = (
  courses: Course[]
): GeneratedSchedule => {
  const schedule: ScheduleSlot[] = [];
  const conflicts: string[] = [];

  // Greedy approach - process courses in order
  for (const course of courses) {
    let slotAdded = false;

    for (
      let slotIndex = 0;
      slotIndex < course.availableSlots.length;
      slotIndex++
    ) {
      const slot = course.availableSlots[slotIndex];
      const potentialSlot: ScheduleSlot = {
        courseCode: course.courseCode,
        days: slot.days,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotIndex: slotIndex,
      };

      // Check for conflicts with already scheduled courses
      const hasConflict = schedule.some((existingSlot) =>
        checkTimeConflict(potentialSlot, existingSlot)
      );

      if (!hasConflict) {
        schedule.push(potentialSlot);
        slotAdded = true;
        break;
      }
    }

    if (!slotAdded) {
      conflicts.push(
        `Could not schedule ${course.courseCode} - all time slots conflict with existing courses`
      );
    }
  }

  return {
    schedule,
    conflicts,
    totalCourses: courses.length,
    scheduledCourses: schedule.length,
    algorithm: "greedy",
    generatedAt: new Date().toISOString(),
  };
};

/**
 * Main schedule generation function that selects appropriate algorithm
 * @param courses - Array of courses with available time slots
 * @param forceAlgorithm - Optional algorithm to force usage
 * @returns Generated schedule
 */
export const generateSchedule = (
  courses: Course[],
  forceAlgorithm?: "backtracking" | "greedy"
): GeneratedSchedule => {
  if (forceAlgorithm) {
    return forceAlgorithm === "backtracking"
      ? generateScheduleBacktracking(courses)
      : generateScheduleGreedy(courses);
  }

  // Use backtracking for optimal results with smaller datasets
  // Use greedy for faster results with larger datasets
  if (courses.length <= BACKTRACKING_COURSE_LIMIT) {
    return generateScheduleBacktracking(courses);
  } else {
    return generateScheduleGreedy(courses);
  }
};
