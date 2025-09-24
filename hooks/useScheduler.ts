import { useForm } from "react-hook-form";
import { useActivityForm } from "./useActivityForm";
import { useDaySelection } from "./useDaySelection";
import { useActivityManagement } from "./useActivityManagement";
import { useScheduleGeneration } from "./useScheduleGeneration";
import { useLocalStorage } from "./useLocalStorage";
import type { DependencyFormData } from "../types/scheduler";

export const useScheduler = () => {
  // Local storage
  const { clearAllData, hasSavedData } = useLocalStorage();
  
  // Forms
  const { courseForm, timeSlotForm } = useActivityForm();
  const dependencyForm = useForm<DependencyFormData>({
    defaultValues: {
      dependentCourseCode: "",
      dependentSlotIndex: undefined,
    },
  });

  // Sub-hooks
  const dayHandlers = useDaySelection(timeSlotForm);
  const courseHandlers = useActivityManagement(
    courseForm,
    timeSlotForm,
    dependencyForm,
    dayHandlers.resetDays
  );
  const scheduleHandlers = useScheduleGeneration(courseHandlers.courses);

  // Global reset function
  const resetScheduler = () => {
    courseHandlers.resetCourses();
    dayHandlers.resetDays();
    scheduleHandlers.resetSchedule();
    courseForm.reset();
    timeSlotForm.reset();
    dependencyForm.reset();
  };

  // Clear all saved data function
  const clearSavedData = () => {
    clearAllData();
    resetScheduler();
  };

  // Computed values
  const canAddCourse = Boolean(
    courseHandlers.currentCourse.courseCode.trim() &&
      courseHandlers.currentCourse.availableSlots.length > 0
  );
  const canGenerateSchedule = courseHandlers.courses.length > 0;
  const hasData =
    courseHandlers.courses.length > 0 ||
    Boolean(scheduleHandlers.generatedSchedule);

  return {
    // State
    courses: courseHandlers.courses,
    currentCourse: courseHandlers.currentCourse,
    currentSlotIndex: courseHandlers.currentSlotIndex,
    editingCourseIndex: courseHandlers.editingCourseIndex,
    selectedDays: dayHandlers.selectedDays,
    generatedSchedule: scheduleHandlers.generatedSchedule,

    // Forms
    courseForm,
    timeSlotForm,
    dependencyForm,

    // Handlers (grouped by concern)
    dayHandlers: {
      handleDayToggle: dayHandlers.handleDayToggle,
      handlePresetSelect: dayHandlers.handlePresetSelect,
      isPresetSelected: dayHandlers.isPresetSelected,
    },
    courseHandlers: {
      onCourseSubmit: courseHandlers.onCourseSubmit,
      onTimeSlotSubmit: courseHandlers.onTimeSlotSubmit,
      onDependencySubmit: courseHandlers.onDependencySubmit,
      addCourse: courseHandlers.addCourse,
      removeCourse: courseHandlers.removeCourse,
      editCourse: courseHandlers.editCourse,
      cancelEdit: courseHandlers.cancelEdit,
      removeTimeSlot: courseHandlers.removeTimeSlot,
      removeDependency: courseHandlers.removeDependency,
      selectSlotForDependencies: courseHandlers.selectSlotForDependencies,
      updateCurrentCourseCode: courseHandlers.updateCurrentCourseCode,
    },
    scheduleHandlers: {
      handleGenerateSchedule: scheduleHandlers.handleGenerateSchedule,
      resetScheduler,
      clearSavedData,
    },

    // Local storage utilities
    localStorageUtils: {
      hasSavedData,
    },

    // Computed values
    canAddCourse,
    canGenerateSchedule,
    hasData,
  };
};
