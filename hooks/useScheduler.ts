import { useCourseForm } from "./useCourseForm";
import { useDaySelection } from "./useDaySelection";
import { useCourseManagement } from "./useCourseManagement";
import { useScheduleGeneration } from "./useScheduleGeneration";

export const useScheduler = () => {
  // Sub-hooks
  const { courseForm, timeSlotForm } = useCourseForm();
  const dayHandlers = useDaySelection(timeSlotForm);
  const courseHandlers = useCourseManagement(
    courseForm,
    timeSlotForm,
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
    selectedDays: dayHandlers.selectedDays,
    generatedSchedule: scheduleHandlers.generatedSchedule,

    // Forms
    courseForm,
    timeSlotForm,

    // Handlers (grouped by concern)
    dayHandlers: {
      handleDayToggle: dayHandlers.handleDayToggle,
      handlePresetSelect: dayHandlers.handlePresetSelect,
      isPresetSelected: dayHandlers.isPresetSelected,
    },
    courseHandlers: {
      onCourseSubmit: courseHandlers.onCourseSubmit,
      onTimeSlotSubmit: courseHandlers.onTimeSlotSubmit,
      addCourse: courseHandlers.addCourse,
      removeCourse: courseHandlers.removeCourse,
      removeTimeSlot: courseHandlers.removeTimeSlot,
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
