import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { Activity, ActivityFormData, TimeSlotFormData, DependencyFormData, TimeSlot, ActivityDependency } from "@/types/scheduler";
import { isValidTimeSlot } from "@/utils";
import { generateSchedule } from "@/algorithms/scheduler";

/**
 * Consolidated actions hook
 * Replaces: useActivityActions, useTimeSlotActions, useDependencyActions, useScheduleGeneration
 */
export const useSchedulerActions = (
  activities: Activity[],
  currentActivity: Activity,
  currentSlotIndex: number | null,
  editingActivityIndex: number | null,
  selectedDays: string[],
  setActivities: (activities: Activity[] | ((prev: Activity[]) => Activity[])) => void,
  setCurrentActivity: (activity: Activity | ((prev: Activity) => Activity)) => void,
  setCurrentSlotIndex: (index: number | null) => void,
  setEditingActivityIndex: (index: number | null) => void,
  setSelectedDays: (days: string[]) => void,
  setGeneratedSchedule: (schedule: any) => void,
  setIsNewlyGenerated: (value: boolean) => void,
  resetCurrentActivity: () => void,
  activityForm: UseFormReturn<ActivityFormData>,
  timeSlotForm: UseFormReturn<TimeSlotFormData>,
  dependencyForm: UseFormReturn<DependencyFormData>
) => {
  // Activity actions
  const addActivity = useCallback(() => {
    if (!currentActivity.activityCode.trim() || currentActivity.availableSlots.length === 0) {
      return;
    }

    if (editingActivityIndex !== null) {
      // Update existing activity
      setActivities((prev) =>
        prev.map((activity, index) =>
          index === editingActivityIndex ? { ...currentActivity } : activity
        )
      );
      setEditingActivityIndex(null);
    } else {
      // Add new activity
      const isDuplicate = activities.some(
        (activity) =>
          activity.activityCode.toLowerCase() === currentActivity.activityCode.toLowerCase()
      );

      if (isDuplicate) {
        activityForm.setError("activityCode", {
          message: "Activity code already exists",
        });
        return;
      }

      setActivities((prev) => [...prev, { ...currentActivity }]);
    }

    resetCurrentActivity();
  }, [
    currentActivity,
    editingActivityIndex,
    activities,
    setActivities,
    setEditingActivityIndex,
    resetCurrentActivity,
    activityForm,
  ]);

  const removeActivity = useCallback((index: number) => {
    const activityToRemove = activities[index];

    setActivities((prev) => {
      const updatedActivities = prev.filter((_, i) => i !== index);

      // Remove any dependencies that reference this activity
      return updatedActivities.map((activity) => ({
        ...activity,
        dependencies: (activity.dependencies || []).filter(
          (dep) => dep.dependentActivityCode !== activityToRemove.activityCode
        ),
      }));
    });

    // Clean current activity dependencies if they reference the removed activity
    setCurrentActivity((prev) => ({
      ...prev,
      dependencies: (prev.dependencies || []).filter(
        (dep) => dep.dependentActivityCode !== activityToRemove.activityCode
      ),
    }));

    // Reset editing if we were editing the removed activity
    if (editingActivityIndex === index) {
      setEditingActivityIndex(null);
      resetCurrentActivity();
    } else if (editingActivityIndex !== null && editingActivityIndex > index) {
      setEditingActivityIndex(editingActivityIndex - 1);
    }
  }, [
    activities,
    editingActivityIndex,
    setActivities,
    setCurrentActivity,
    setEditingActivityIndex,
    resetCurrentActivity,
  ]);

  const editActivity = useCallback((index: number) => {
    const activityToEdit = activities[index];
    setCurrentActivity({ ...activityToEdit });
    setEditingActivityIndex(index);
    activityForm.setValue("activityCode", activityToEdit.activityCode);
  }, [activities, setCurrentActivity, setEditingActivityIndex, activityForm]);

  const cancelEdit = useCallback(() => {
    setEditingActivityIndex(null);
    resetCurrentActivity();
  }, [setEditingActivityIndex, resetCurrentActivity]);

  // Time slot actions
  const addTimeSlot = useCallback((data: TimeSlotFormData) => {
    if (!isValidTimeSlot(data.startTime, data.endTime)) {
      timeSlotForm.setError("endTime", {
        message: "End time must be after start time",
      });
      return;
    }

    if (data.days.length === 0) {
      timeSlotForm.setError("days", {
        message: "Please select at least one day",
      });
      return;
    }

    const newSlot: TimeSlot = {
      days: data.days,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    setCurrentActivity((prev) => ({
      ...prev,
      availableSlots: [...prev.availableSlots, newSlot],
    }));

    timeSlotForm.reset();
    setSelectedDays([]);
  }, [setCurrentActivity, timeSlotForm, setSelectedDays]);

  const removeTimeSlot = useCallback((index: number) => {
    setCurrentActivity((prev) => {
      const newSlots = prev.availableSlots.filter((_, i) => i !== index);

      // Remove dependencies for this slot and adjust indices for higher slots
      const updatedDependencies = (prev.dependencies || [])
        .filter(
          (dep) =>
            !(dep.activityCode === prev.activityCode && dep.slotIndex === index)
        )
        .map((dep) => ({
          ...dep,
          slotIndex:
            dep.activityCode === prev.activityCode && dep.slotIndex > index
              ? dep.slotIndex - 1
              : dep.slotIndex,
          dependentSlotIndex:
            dep.dependentActivityCode === prev.activityCode &&
            dep.dependentSlotIndex > index
              ? dep.dependentSlotIndex - 1
              : dep.dependentSlotIndex,
        }));

      return {
        ...prev,
        availableSlots: newSlots,
        dependencies: updatedDependencies,
      };
    });

    // Update current slot index
    if (currentSlotIndex === index) {
      setCurrentSlotIndex(null);
    } else if (currentSlotIndex !== null && currentSlotIndex > index) {
      setCurrentSlotIndex(currentSlotIndex - 1);
    }
  }, [currentActivity, currentSlotIndex, setCurrentActivity, setCurrentSlotIndex]);

  const selectSlotForDependencies = useCallback((slotIndex: number) => {
    setCurrentSlotIndex(slotIndex);
  }, [setCurrentSlotIndex]);

  // Day selection actions
  const handleDayToggle = useCallback((day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    timeSlotForm.setValue("days", newDays);
  }, [selectedDays, setSelectedDays, timeSlotForm]);

  const handlePresetSelect = useCallback((presetDays: string[]) => {
    setSelectedDays(presetDays);
    timeSlotForm.setValue("days", presetDays);
  }, [setSelectedDays, timeSlotForm]);

  const isPresetSelected = useCallback((presetDays: string[]): boolean => {
    return JSON.stringify(selectedDays.sort()) === JSON.stringify(presetDays.sort());
  }, [selectedDays]);

  const resetDays = useCallback(() => {
    setSelectedDays([]);
  }, [setSelectedDays]);

  // Dependency actions
  const addDependency = useCallback((data: DependencyFormData) => {
    if (currentSlotIndex === null) return;

    // Check if dependency already exists
    const dependencyExists = currentActivity.dependencies?.some(
      (dep) =>
        dep.activityCode === currentActivity.activityCode &&
        dep.slotIndex === currentSlotIndex &&
        dep.dependentActivityCode === data.dependentActivityCode &&
        dep.dependentSlotIndex === data.dependentSlotIndex
    );

    if (dependencyExists) {
      dependencyForm.setError("dependentActivityCode", {
        message: "This dependency already exists",
      });
      return;
    }

    const newDependency: ActivityDependency = {
      activityCode: currentActivity.activityCode,
      slotIndex: currentSlotIndex,
      dependentActivityCode: data.dependentActivityCode,
      dependentSlotIndex: data.dependentSlotIndex,
    };

    setCurrentActivity((prev) => ({
      ...prev,
      dependencies: [...(prev.dependencies || []), newDependency],
    }));

    dependencyForm.reset();
  }, [
    currentActivity,
    currentSlotIndex,
    setCurrentActivity,
    dependencyForm,
  ]);

  const removeDependency = useCallback((dependencyIndex: number) => {
    if (currentSlotIndex === null) return;

    setCurrentActivity((prev) => {
      const currentSlotDependencies = (prev.dependencies || []).filter(
        (dep) =>
          dep.activityCode === prev.activityCode &&
          dep.slotIndex === currentSlotIndex
      );

      if (dependencyIndex >= currentSlotDependencies.length) return prev;

      const dependencyToRemove = currentSlotDependencies[dependencyIndex];

      return {
        ...prev,
        dependencies: (prev.dependencies || []).filter(
          (dep) => dep !== dependencyToRemove
        ),
      };
    });
  }, [currentSlotIndex, setCurrentActivity]);

  // Schedule generation
  const handleGenerateSchedule = useCallback(() => {
    if (activities.length === 0) return;

    const result = generateSchedule(activities);
    setGeneratedSchedule(result);
    setIsNewlyGenerated(true);
  }, [activities, setGeneratedSchedule, setIsNewlyGenerated]);

  // Form submission handlers
  const onActivitySubmit = useCallback((data: ActivityFormData) => {
    setCurrentActivity((prev) => ({
      ...prev,
      activityCode: data.activityCode,
    }));
  }, [setCurrentActivity]);

  const updateCurrentActivityCode = useCallback((activityCode: string) => {
    setCurrentActivity((prev) => ({
      ...prev,
      activityCode,
    }));
  }, [setCurrentActivity]);

  return {
    // Activity actions
    addActivity,
    removeActivity,
    editActivity,
    cancelEdit,

    // Time slot actions
    addTimeSlot,
    removeTimeSlot,
    selectSlotForDependencies,

    // Day selection actions
    handleDayToggle,
    handlePresetSelect,
    isPresetSelected,
    resetDays,

    // Dependency actions
    addDependency,
    removeDependency,

    // Schedule generation
    handleGenerateSchedule,

    // Form handlers
    onActivitySubmit,
    onTimeSlotSubmit: addTimeSlot,
    onDependencySubmit: addDependency,
    updateCurrentActivityCode,
  };
};
