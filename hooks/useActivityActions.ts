import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Course,
  CourseFormData,
  TimeSlot,
  TimeSlotFormData,
  CourseDependency,
  DependencyFormData,
} from "../types/scheduler";
import { isValidTimeSlot } from "../utils";

/**
 * Manages course-related actions (add, remove, edit, etc.)
 */
export const useActivityActions = (
  courses: Course[],
  currentCourse: Course,
  editingCourseIndex: number | null,
  setCourses: (courses: Course[] | ((prev: Course[]) => Course[])) => void,
  setCurrentCourse: (course: Course | ((prev: Course) => Course)) => void,
  setEditingCourseIndex: (index: number | null) => void,
  resetCurrentCourse: () => void,
  courseForm: UseFormReturn<CourseFormData>
) => {
  const addCourse = useCallback(() => {
    if (!currentCourse.courseCode.trim() || currentCourse.availableSlots.length === 0) {
      return;
    }

    if (editingCourseIndex !== null) {
      // Update existing course
      setCourses((prev) =>
        prev.map((course, index) =>
          index === editingCourseIndex ? { ...currentCourse } : course
        )
      );
      setEditingCourseIndex(null);
    } else {
      // Add new course
      const isDuplicate = courses.some(
        (course) =>
          course.courseCode.toLowerCase() === currentCourse.courseCode.toLowerCase()
      );

      if (isDuplicate) {
        courseForm.setError("courseCode", {
          message: "Course code already exists",
        });
        return;
      }

      setCourses((prev) => [...prev, { ...currentCourse }]);
    }

    resetCurrentCourse();
  }, [
    currentCourse,
    editingCourseIndex,
    courses,
    setCourses,
    setEditingCourseIndex,
    resetCurrentCourse,
    courseForm,
  ]);

  const removeCourse = useCallback((index: number) => {
    const courseToRemove = courses[index];

    setCourses((prev) => {
      const updatedCourses = prev.filter((_, i) => i !== index);

      // Remove any dependencies that reference this course
      return updatedCourses.map((course) => ({
        ...course,
        dependencies: (course.dependencies || []).filter(
          (dep) => dep.dependentCourseCode !== courseToRemove.courseCode
        ),
      }));
    });

    // Clean current course dependencies if they reference the removed course
    setCurrentCourse((prev) => ({
      ...prev,
      dependencies: (prev.dependencies || []).filter(
        (dep) => dep.dependentCourseCode !== courseToRemove.courseCode
      ),
    }));

    // Reset editing if we were editing the removed course
    if (editingCourseIndex === index) {
      setEditingCourseIndex(null);
      resetCurrentCourse();
    } else if (editingCourseIndex !== null && editingCourseIndex > index) {
      setEditingCourseIndex(editingCourseIndex - 1);
    }
  }, [
    courses,
    editingCourseIndex,
    setCourses,
    setCurrentCourse,
    setEditingCourseIndex,
    resetCurrentCourse,
  ]);

  const editCourse = useCallback((index: number) => {
    const courseToEdit = courses[index];
    setCurrentCourse({ ...courseToEdit });
    setEditingCourseIndex(index);
    courseForm.setValue("courseCode", courseToEdit.courseCode);
  }, [courses, setCurrentCourse, setEditingCourseIndex, courseForm]);

  const cancelEdit = useCallback(() => {
    setEditingCourseIndex(null);
    resetCurrentCourse();
  }, [setEditingCourseIndex, resetCurrentCourse]);

  return {
    addCourse,
    removeCourse,
    editCourse,
    cancelEdit,
  };
};
