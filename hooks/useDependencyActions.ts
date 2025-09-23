import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Course,
  CourseDependency,
  DependencyFormData,
} from "../types/scheduler";

/**
 * Manages dependency-related actions
 */
export const useDependencyActions = (
  currentCourse: Course,
  currentSlotIndex: number | null,
  setCurrentCourse: (course: Course | ((prev: Course) => Course)) => void,
  dependencyForm: UseFormReturn<DependencyFormData>
) => {
  const addDependency = useCallback((data: DependencyFormData) => {
    if (currentSlotIndex === null) return;

    // Check if dependency already exists
    const dependencyExists = currentCourse.dependencies?.some(
      (dep) =>
        dep.courseCode === currentCourse.courseCode &&
        dep.slotIndex === currentSlotIndex &&
        dep.dependentCourseCode === data.dependentCourseCode &&
        dep.dependentSlotIndex === data.dependentSlotIndex
    );

    if (dependencyExists) {
      dependencyForm.setError("dependentCourseCode", {
        message: "This dependency already exists",
      });
      return;
    }

    const newDependency: CourseDependency = {
      courseCode: currentCourse.courseCode,
      slotIndex: currentSlotIndex,
      dependentCourseCode: data.dependentCourseCode,
      dependentSlotIndex: data.dependentSlotIndex,
    };

    setCurrentCourse((prev) => ({
      ...prev,
      dependencies: [...(prev.dependencies || []), newDependency],
    }));

    dependencyForm.reset();
  }, [
    currentCourse,
    currentSlotIndex,
    setCurrentCourse,
    dependencyForm,
  ]);

  const removeDependency = useCallback((dependencyIndex: number) => {
    if (currentSlotIndex === null) return;

    setCurrentCourse((prev) => {
      const currentSlotDependencies = (prev.dependencies || []).filter(
        (dep) =>
          dep.courseCode === prev.courseCode &&
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
  }, [currentSlotIndex, setCurrentCourse]);

  return {
    addDependency,
    removeDependency,
  };
};
