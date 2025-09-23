import {
  Course,
  GeneratedSchedule,
  ScheduleSlot,
} from "../types/scheduler";
import { checkTimeConflict } from "../utils/scheduler";

/**
 * Gets all slots that must be scheduled together with the given slot
 */
const getMandatoryDependentSlots = (
  course: Course,
  slotIndex: number,
  allCourses: Course[]
): ScheduleSlot[] => {
  if (!course.dependencies) return [];

  const dependentSlots: ScheduleSlot[] = [];

  // Get dependencies for this specific slot
  const slotDependencies = course.dependencies.filter(
    (dep) => dep.courseCode === course.courseCode && dep.slotIndex === slotIndex
  );

  for (const dependency of slotDependencies) {
    const dependentCourse = allCourses.find(
      (c) => c.courseCode === dependency.dependentCourseCode
    );

    if (dependentCourse?.availableSlots[dependency.dependentSlotIndex]) {
      const dependentSlot =
        dependentCourse.availableSlots[dependency.dependentSlotIndex];
      dependentSlots.push({
        courseCode: dependency.dependentCourseCode,
        days: dependentSlot.days,
        startTime: dependentSlot.startTime,
        endTime: dependentSlot.endTime,
        slotIndex: dependency.dependentSlotIndex,
      });
    }
  }

  return dependentSlots;
};

/**
 * Checks if any slots conflict with each other
 */
const hasTimeConflicts = (slots: ScheduleSlot[]): boolean => {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (checkTimeConflict(slots[i], slots[j])) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Checks if adding new slots would create conflicts with existing schedule
 */
const wouldCreateConflicts = (
  newSlots: ScheduleSlot[],
  currentSchedule: ScheduleSlot[]
): boolean => {
  // Check conflicts between new slots and existing schedule
  for (const newSlot of newSlots) {
    for (const existingSlot of currentSchedule) {
      if (checkTimeConflict(newSlot, existingSlot)) {
        return true;
      }
    }
  }

  // Check conflicts within new slots themselves
  return hasTimeConflicts(newSlots);
};

/**
 * Checks if we're trying to schedule the same course-slot combination twice
 */
const hasDoubleScheduling = (
  newSlots: ScheduleSlot[],
  currentSchedule: ScheduleSlot[]
): boolean => {
  const existingSlotIds = new Set(
    currentSchedule.map((slot) => `${slot.courseCode}-${slot.slotIndex}`)
  );

  const newSlotIds = newSlots.map(
    (slot) => `${slot.courseCode}-${slot.slotIndex}`
  );

  return newSlotIds.some((id) => existingSlotIds.has(id));
};

/**
 * Generates schedule using backtracking algorithm with dependency support
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

      // Get all dependent slots that must be scheduled with this slot
      const mandatoryDependentSlots = getMandatoryDependentSlots(
        course,
        slotIndex,
        courses
      );

      const slotsToAdd = [potentialSlot, ...mandatoryDependentSlots];

      // Check various conflict conditions
      if (
        !wouldCreateConflicts(slotsToAdd, currentSchedule) &&
        !hasDoubleScheduling(slotsToAdd, currentSchedule)
      ) {
        // Add all slots and recurse
        currentSchedule.push(...slotsToAdd);
        backtrack(courseIndex + 1, currentSchedule);

        // Backtrack: remove all added slots
        for (let i = 0; i < slotsToAdd.length; i++) {
          currentSchedule.pop();
        }
      }
    }

    // Also try skipping this course
    backtrack(courseIndex + 1, currentSchedule);
  };

  // Start backtracking
  backtrack(0, []);

  // Generate analysis
  const scheduledCourseSlots = new Set(
    bestSchedule.map((slot) => `${slot.courseCode}-${slot.slotIndex}`)
  );

  const conflicts: string[] = [];
  const dependencyViolations: string[] = [];

  // Analyze results
  courses.forEach((course) => {
    const courseScheduled = bestSchedule.some(
      (slot) => slot.courseCode === course.courseCode
    );

    if (!courseScheduled) {
      conflicts.push(`Could not schedule ${course.courseCode}`);
    } else {
      // Check dependency violations for scheduled courses
      course.availableSlots.forEach((slot, slotIndex) => {
        if (scheduledCourseSlots.has(`${course.courseCode}-${slotIndex}`)) {
          const mandatoryDeps = getMandatoryDependentSlots(
            course,
            slotIndex,
            courses
          );

          mandatoryDeps.forEach((dep) => {
            if (
              !scheduledCourseSlots.has(`${dep.courseCode}-${dep.slotIndex}`)
            ) {
              dependencyViolations.push(
                `Dependency violation: ${course.courseCode} slot ${
                  slotIndex + 1
                } requires ${dep.courseCode} slot ${dep.slotIndex + 1}`
              );
            }
          });
        }
      });
    }
  });

  return {
    schedule: bestSchedule,
    conflicts,
    totalCourses: courses.length,
    scheduledCourses: new Set(bestSchedule.map((slot) => slot.courseCode)).size,
    algorithm: "backtracking",
    generatedAt: new Date().toISOString(),
    dependencyViolations,
  };
};

/**
 * Main schedule generation function
 */
export const generateSchedule = (courses: Course[]): GeneratedSchedule => {
  return generateScheduleBacktracking(courses);
};
