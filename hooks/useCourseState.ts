import { useState, useCallback } from "react";
import { Course } from "../types/scheduler";

/**
 * Manages the core course state (courses list, current course, editing state)
 */
export const useCourseState = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course>({
    courseCode: "",
    availableSlots: [],
    dependencies: [],
  });
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);

  const resetCurrentCourse = useCallback(() => {
    setCurrentCourse({
      courseCode: "",
      availableSlots: [],
      dependencies: [],
    });
    setCurrentSlotIndex(null);
  }, []);

  const resetAllCourses = useCallback(() => {
    setCourses([]);
    setEditingCourseIndex(null);
    resetCurrentCourse();
  }, [resetCurrentCourse]);

  return {
    // State
    courses,
    currentCourse,
    currentSlotIndex,
    editingCourseIndex,
    
    // Setters
    setCourses,
    setCurrentCourse,
    setCurrentSlotIndex,
    setEditingCourseIndex,
    
    // Helpers
    resetCurrentCourse,
    resetAllCourses,
  };
};
