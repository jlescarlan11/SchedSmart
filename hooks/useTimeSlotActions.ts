import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Course,
  TimeSlot,
  TimeSlotFormData,
} from "../types/scheduler";
import { isValidTimeSlot } from "../utils";

/**
 * Manages time slot related actions
 */
export const useTimeSlotActions = (
  currentCourse: Course,
  currentSlotIndex: number | null,
  setCurrentCourse: (course: Course | ((prev: Course) => Course)) => void,
  setCurrentSlotIndex: (index: number | null) => void,
  timeSlotForm: UseFormReturn<TimeSlotFormData>,
  resetDays: () => void
) => {
  const addTimeSlot = useCallback((data: TimeSlotFormData) => {
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
  }, [setCurrentCourse, timeSlotForm, resetDays]);

  const removeTimeSlot = useCallback((index: number) => {
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
  }, [currentCourse, currentSlotIndex, setCurrentCourse, setCurrentSlotIndex]);

  const selectSlotForDependencies = useCallback((slotIndex: number) => {
    setCurrentSlotIndex(slotIndex);
  }, [setCurrentSlotIndex]);

  return {
    addTimeSlot,
    removeTimeSlot,
    selectSlotForDependencies,
  };
};
