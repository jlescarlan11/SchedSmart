import { useForm } from "react-hook-form";
import { useCourseForm } from "./useCourseForm";
import { useDaySelection } from "./useDaySelection";
import { useCourseManagement } from "./useCourseManagement";
import { useScheduleGeneration } from "./useScheduleGeneration";
import type { DependencyFormData } from "../types/scheduler";

export const useScheduler = () => {
  // Forms
  const { courseForm, timeSlotForm } = useCourseForm();
  const dependencyForm = useForm<DependencyFormData>({
    defaultValues: {
      dependentCourseCode: "",
      dependentSlotIndex: undefined,
    },
  });

  // Sub-hooks
  const dayHandlers = useDaySelection(timeSlotForm);
  const courseHandlers = useCourseManagement(
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
    isGenerating: scheduleHandlers.isGenerating, // Added loading state

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
    },

    // Computed values
    canAddCourse,
    canGenerateSchedule,
    hasData,
  };
};
