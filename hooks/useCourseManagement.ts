import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  CourseFormData,
  TimeSlotFormData,
  DependencyFormData,
} from "../types/scheduler";

// Import the focused hooks
import { useCourseState } from "./useCourseState";
import { useCourseActions } from "./useCourseActions";
import { useTimeSlotActions } from "./useTimeSlotActions";
import { useDependencyActions } from "./useDependencyActions";

/**
 * Main course management hook that orchestrates all course-related functionality
 * This is a cleaner, more organized version that delegates to focused hooks
 */
export const useCourseManagement = (
  courseForm: UseFormReturn<CourseFormData>,
  timeSlotForm: UseFormReturn<TimeSlotFormData>,
  dependencyForm: UseFormReturn<DependencyFormData>,
  resetDays: () => void
) => {
  // Core state management
  const {
    courses,
    currentCourse,
    currentSlotIndex,
    editingCourseIndex,
    setCourses,
    setCurrentCourse,
    setCurrentSlotIndex,
    setEditingCourseIndex,
    resetCurrentCourse,
    resetAllCourses,
  } = useCourseState();

  // Course actions (add, remove, edit)
  const courseActions = useCourseActions(
    courses,
    currentCourse,
    editingCourseIndex,
    setCourses,
    setCurrentCourse,
    setEditingCourseIndex,
    resetCurrentCourse,
    courseForm
  );

  // Time slot actions
  const timeSlotActions = useTimeSlotActions(
    currentCourse,
    currentSlotIndex,
    setCurrentCourse,
    setCurrentSlotIndex,
    timeSlotForm,
    resetDays
  );

  // Dependency actions
  const dependencyActions = useDependencyActions(
    currentCourse,
    currentSlotIndex,
    setCurrentCourse,
    dependencyForm
  );

  // Form submission handlers
  const onCourseSubmit = useCallback((data: CourseFormData) => {
    setCurrentCourse((prev) => ({
      ...prev,
      courseCode: data.courseCode,
    }));
  }, [setCurrentCourse]);

  const updateCurrentCourseCode = useCallback((courseCode: string) => {
    setCurrentCourse((prev) => ({
      ...prev,
      courseCode,
    }));
  }, [setCurrentCourse]);

  // Enhanced reset that also clears forms
  const resetCourses = useCallback(() => {
    resetAllCourses();
    courseForm.reset();
  }, [resetAllCourses, courseForm]);

  return {
    // State
    courses,
    currentCourse,
    currentSlotIndex,
    editingCourseIndex,

    // Form handlers
    onCourseSubmit,
    onTimeSlotSubmit: timeSlotActions.addTimeSlot,
    onDependencySubmit: dependencyActions.addDependency,
    updateCurrentCourseCode,

    // Course actions
    addCourse: courseActions.addCourse,
    removeCourse: courseActions.removeCourse,
    editCourse: courseActions.editCourse,
    cancelEdit: courseActions.cancelEdit,

    // Time slot actions
    removeTimeSlot: timeSlotActions.removeTimeSlot,
    selectSlotForDependencies: timeSlotActions.selectSlotForDependencies,

    // Dependency actions
    removeDependency: dependencyActions.removeDependency,

    // Reset
    resetCourses,
  };
};
