import { useSchedulerState } from "./useSchedulerState";
import { useSchedulerActions } from "./useSchedulerActions";
import { useSchedulerForms } from "./useSchedulerForms";
import { useStepFlow } from "./useStepFlow";

/**
 * Consolidated scheduler hook
 * Replaces: useActivityForm, useDaySelection, useActivityManagement, 
 * useScheduleGeneration, useLocalStorage, useStepFlow
 */
export const useScheduler = () => {
  // Step flow management
  const stepFlow = useStepFlow();
  
  // Forms
  const { activityForm, timeSlotForm, dependencyForm } = useSchedulerForms();

  // State management
  const {
    activities,
    currentActivity,
    currentSlotIndex,
    editingActivityIndex,
    selectedDays,
    generatedSchedule,
    isNewlyGenerated,
    hasData,
    canAddActivity,
    canGenerateSchedule,
    setActivities,
    setCurrentActivity,
    setCurrentSlotIndex,
    setEditingActivityIndex,
    setSelectedDays,
    setGeneratedSchedule,
    setIsNewlyGenerated,
    resetCurrentActivity,
    resetAllActivities,
    resetSchedule,
    clearAllData,
    hasSavedData,
  } = useSchedulerState();

  // Actions
  const {
    addActivity,
    removeActivity,
    editActivity,
    cancelEdit,
    addTimeSlot,
    removeTimeSlot,
    selectSlotForDependencies,
    handleDayToggle,
    handlePresetSelect,
    isPresetSelected,
    resetDays,
    addDependency,
    removeDependency,
    handleGenerateSchedule,
    onActivitySubmit,
    onTimeSlotSubmit,
    onDependencySubmit,
    updateCurrentActivityCode,
  } = useSchedulerActions(
    activities,
    currentActivity,
    currentSlotIndex,
    editingActivityIndex,
    selectedDays,
    setActivities,
    setCurrentActivity,
    setCurrentSlotIndex,
    setEditingActivityIndex,
    setSelectedDays,
    setGeneratedSchedule,
    setIsNewlyGenerated,
    resetCurrentActivity,
    activityForm,
    timeSlotForm,
    dependencyForm
  );

  // Global reset function
  const resetScheduler = () => {
    resetAllActivities();
    resetDays();
    resetSchedule();
    stepFlow.resetSteps();
    activityForm.reset();
    timeSlotForm.reset();
    dependencyForm.reset();
  };

  // Clear all saved data function
  const clearSavedData = () => {
    clearAllData();
    resetScheduler();
  };

  return {
    // State
    activities,
    currentActivity,
    currentSlotIndex,
    editingActivityIndex,
    selectedDays,
    generatedSchedule,
    isNewlyGenerated,
    hasData,
    canAddActivity,
    canGenerateSchedule,

    // Forms
    activityForm,
    timeSlotForm,
    dependencyForm,

    // Step flow
    stepFlow,

    // Day handlers
    dayHandlers: {
      handleDayToggle,
      handlePresetSelect,
      isPresetSelected,
      resetDays,
    },

    // Activity handlers
    activityHandlers: {
      onActivitySubmit,
      onTimeSlotSubmit,
      onDependencySubmit,
      updateCurrentActivityCode,
      addActivity,
      removeActivity,
      editActivity,
      cancelEdit,
      removeTimeSlot,
      selectSlotForDependencies,
      removeDependency,
      resetActivities: resetAllActivities,
    },

    // Schedule handlers
    scheduleHandlers: {
      handleGenerateSchedule,
      resetScheduler,
      clearSavedData,
    },

    // Local storage utilities
    localStorageUtils: {
      hasSavedData,
    },
  };
};