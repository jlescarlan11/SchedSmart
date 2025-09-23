import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Course,
  CourseFormData,
  TimeSlot,
  TimeSlotFormData,
  CourseDependency,
  DependencyFormData,
} from "../types/scheduler";
import { isValidTimeSlot } from "../utils/scheduler";

export const useCourseManagement = (
  courseForm: UseFormReturn<CourseFormData>,
  timeSlotForm: UseFormReturn<TimeSlotFormData>,
  dependencyForm: UseFormReturn<DependencyFormData>,
  resetDays: () => void
) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course>({
    courseCode: "",
    availableSlots: [],
    dependencies: [],
  });
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(
    null
  );

  const onCourseSubmit = (data: CourseFormData) => {
    setCurrentCourse((prev) => ({
      ...prev,
      courseCode: data.courseCode,
    }));
  };

  const onTimeSlotSubmit = (data: TimeSlotFormData) => {
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

    setCurrentCourse((prev) => ({
      ...prev,
      availableSlots: [...prev.availableSlots, newSlot],
    }));

    timeSlotForm.reset();
    resetDays();
  };

  const onDependencySubmit = (data: DependencyFormData) => {
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
  };

  const removeDependency = (dependencyIndex: number) => {
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
  };

  const addCourse = () => {
    if (
      !currentCourse.courseCode.trim() ||
      currentCourse.availableSlots.length === 0
    )
      return;

    // Check if we're editing
    if (editingCourseIndex !== null) {
      setCourses((prev) =>
        prev.map((course, index) =>
          index === editingCourseIndex ? { ...currentCourse } : course
        )
      );
      setEditingCourseIndex(null);
    } else {
      // Adding new course
      const isDuplicate = courses.some(
        (course) =>
          course.courseCode.toLowerCase() ===
          currentCourse.courseCode.toLowerCase()
      );

      if (isDuplicate) {
        courseForm.setError("courseCode", {
          message: "Course code already exists",
        });
        return;
      }

      setCourses((prev) => [...prev, { ...currentCourse }]);
    }

    // Reset state
    resetCurrentCourse();
  };

  const removeCourse = (index: number) => {
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
  };

  const editCourse = (index: number) => {
    const courseToEdit = courses[index];
    setCurrentCourse({ ...courseToEdit });
    setEditingCourseIndex(index);
    setCurrentSlotIndex(null);

    // Update form with course data
    courseForm.setValue("courseCode", courseToEdit.courseCode);
  };

  const cancelEdit = () => {
    setEditingCourseIndex(null);
    resetCurrentCourse();
  };

  const removeTimeSlot = (index: number) => {
    setCurrentCourse((prev) => {
      const newSlots = prev.availableSlots.filter((_, i) => i !== index);

      // Remove dependencies for this slot and adjust indices for higher slots
      const updatedDependencies = (prev.dependencies || [])
        .filter(
          (dep) =>
            !(dep.courseCode === prev.courseCode && dep.slotIndex === index)
        )
        .map((dep) => ({
          ...dep,
          slotIndex:
            dep.courseCode === prev.courseCode && dep.slotIndex > index
              ? dep.slotIndex - 1
              : dep.slotIndex,
          dependentSlotIndex:
            dep.dependentCourseCode === prev.courseCode &&
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
  };

  const selectSlotForDependencies = (slotIndex: number) => {
    setCurrentSlotIndex(slotIndex);
  };

  const updateCurrentCourseCode = (courseCode: string) => {
    setCurrentCourse((prev) => ({
      ...prev,
      courseCode,
    }));
  };

  const resetCurrentCourse = () => {
    setCurrentCourse({
      courseCode: "",
      availableSlots: [],
      dependencies: [],
    });
    setCurrentSlotIndex(null);
    courseForm.reset();
  };

  const resetCourses = () => {
    setCourses([]);
    setEditingCourseIndex(null);
    resetCurrentCourse();
  };

  return {
    courses,
    currentCourse,
    currentSlotIndex,
    editingCourseIndex,
    onCourseSubmit,
    onTimeSlotSubmit,
    onDependencySubmit,
    addCourse,
    removeCourse,
    editCourse,
    cancelEdit,
    removeTimeSlot,
    removeDependency,
    selectSlotForDependencies,
    updateCurrentCourseCode,
    resetCourses,
  };
};
