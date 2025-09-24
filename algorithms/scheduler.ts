import {
  Activity,
  GeneratedSchedule,
  ScheduleSlot,
} from "../types/scheduler";
import { checkTimeConflict } from "../utils";

/**
 * Gets all slots that must be scheduled together with the given slot
 */
const getMandatoryDependentSlots = (
  activity: Activity,
  slotIndex: number,
  allActivities: Activity[]
): ScheduleSlot[] => {
  if (!activity.dependencies) return [];

  const dependentSlots: ScheduleSlot[] = [];

  // Get dependencies for this specific slot
  const slotDependencies = activity.dependencies.filter(
    (dep) => dep.activityCode === activity.activityCode && dep.slotIndex === slotIndex
  );

  for (const dependency of slotDependencies) {
    const dependentActivity = allActivities.find(
      (a) => a.activityCode === dependency.dependentActivityCode
    );

    if (dependentActivity?.availableSlots[dependency.dependentSlotIndex]) {
      const dependentSlot =
        dependentActivity.availableSlots[dependency.dependentSlotIndex];
      dependentSlots.push({
        activityCode: dependency.dependentActivityCode,
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
 * Checks if we're trying to schedule the same activity-slot combination twice
 */
const hasDoubleScheduling = (
  newSlots: ScheduleSlot[],
  currentSchedule: ScheduleSlot[]
): boolean => {
  const existingSlotIds = new Set(
    currentSchedule.map((slot) => `${slot.activityCode}-${slot.slotIndex}`)
  );

  const newSlotIds = newSlots.map(
    (slot) => `${slot.activityCode}-${slot.slotIndex}`
  );

  return newSlotIds.some((id) => existingSlotIds.has(id));
};

/**
 * Generates schedule using backtracking algorithm with dependency support
 */
export const generateScheduleBacktracking = (
  activities: Activity[]
): GeneratedSchedule => {
  let bestSchedule: ScheduleSlot[] = [];
  let bestCount = 0;

  const backtrack = (
    activityIndex: number,
    currentSchedule: ScheduleSlot[]
  ): void => {
    // Base case: processed all activities
    if (activityIndex === activities.length) {
      if (currentSchedule.length > bestCount) {
        bestCount = currentSchedule.length;
        bestSchedule = [...currentSchedule];
      }
      return;
    }

    const activity = activities[activityIndex];

    // Check if this activity has any slots already scheduled as dependencies
    const alreadyScheduledSlots = new Set(
      currentSchedule
        .filter(slot => slot.activityCode === activity.activityCode)
        .map(slot => slot.slotIndex)
    );

    // Try each available slot for this activity
    for (
      let slotIndex = 0;
      slotIndex < activity.availableSlots.length;
      slotIndex++
    ) {
      // Skip if this slot is already scheduled as a dependency
      if (alreadyScheduledSlots.has(slotIndex)) {
        continue;
      }

      const slot = activity.availableSlots[slotIndex];
      const potentialSlot: ScheduleSlot = {
        activityCode: activity.activityCode,
        days: slot.days,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotIndex: slotIndex,
      };

      // Get all dependent slots that must be scheduled with this slot
      const mandatoryDependentSlots = getMandatoryDependentSlots(
        activity,
        slotIndex,
        activities
      );

      const slotsToAdd = [potentialSlot, ...mandatoryDependentSlots];

      // Check various conflict conditions
      if (
        !wouldCreateConflicts(slotsToAdd, currentSchedule) &&
        !hasDoubleScheduling(slotsToAdd, currentSchedule)
      ) {
        // Add all slots and recurse
        currentSchedule.push(...slotsToAdd);
        backtrack(activityIndex + 1, currentSchedule);

        // Backtrack: remove all added slots
        for (let i = 0; i < slotsToAdd.length; i++) {
          currentSchedule.pop();
        }
      }
    }

    // Also try skipping this activity
    backtrack(activityIndex + 1, currentSchedule);
  };

  // Start backtracking
  backtrack(0, []);

  // Generate analysis
  const scheduledActivitySlots = new Set(
    bestSchedule.map((slot) => `${slot.activityCode}-${slot.slotIndex}`)
  );

  const conflicts: string[] = [];
  const dependencyViolations: string[] = [];

  // Analyze results
  activities.forEach((activity) => {
    const activityScheduled = bestSchedule.some(
      (slot) => slot.activityCode === activity.activityCode
    );

    if (!activityScheduled) {
      conflicts.push(`Could not schedule ${activity.activityCode}`);
    } else {
      // Check dependency violations for scheduled activities
      activity.availableSlots.forEach((slot, slotIndex) => {
        if (scheduledActivitySlots.has(`${activity.activityCode}-${slotIndex}`)) {
          const mandatoryDeps = getMandatoryDependentSlots(
            activity,
            slotIndex,
            activities
          );

          mandatoryDeps.forEach((dep) => {
            if (
              !scheduledActivitySlots.has(`${dep.activityCode}-${dep.slotIndex}`)
            ) {
              dependencyViolations.push(
                `Dependency violation: ${activity.activityCode} slot ${
                  slotIndex + 1
                } requires ${dep.activityCode} slot ${dep.slotIndex + 1}`
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
    totalActivities: activities.length,
    scheduledActivities: new Set(bestSchedule.map((slot) => slot.activityCode)).size,
    algorithm: "backtracking",
    generatedAt: new Date().toISOString(),
    dependencyViolations,
  };
};

/**
 * Main schedule generation function
 */
export const generateSchedule = (activities: Activity[]): GeneratedSchedule => {
  return generateScheduleBacktracking(activities);
};
