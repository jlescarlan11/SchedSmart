import { useState, useCallback, useEffect } from "react";
import { Course } from "../types/scheduler";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Manages the core course state (courses list, current course, editing state)
 */
export const useActivityState = () => {
  const { loadCourses, saveCourses } = useLocalStorage();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course>({
    courseCode: "",
    availableSlots: [],
    dependencies: [],
  });
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);

  // Load courses from local storage on initialization
  useEffect(() => {
    const savedCourses = loadCourses();
    if (savedCourses.length > 0) {
      setCourses(savedCourses);
    }
  }, [loadCourses]);

  // Save courses to local storage whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      saveCourses(courses);
    }
  }, [courses, saveCourses]);

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
    // Clear courses from local storage when resetting
    saveCourses([]);
  }, [resetCurrentCourse, saveCourses]);

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
