import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Course,
  CourseFormData,
  TimeSlot,
  TimeSlotFormData,
} from "../types/scheduler";
import { isValidTimeSlot } from "../utils/scheduler";

export const useCourseManagement = (
  courseForm: UseFormReturn<CourseFormData>,
  timeSlotForm: UseFormReturn<TimeSlotFormData>,
  resetDays: () => void
) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course>({
    courseCode: "",
    availableSlots: [],
  });

  const onCourseSubmit = (data: CourseFormData) => {
    setCurrentCourse((prev) => ({ ...prev, courseCode: data.courseCode }));
  };

  const onTimeSlotSubmit = (data: TimeSlotFormData) => {
    if (!isValidTimeSlot(data.startTime, data.endTime)) {
      timeSlotForm.setError("endTime", {
        message: "End time must be after start time",
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

  const addCourse = () => {
    if (
      !currentCourse.courseCode.trim() ||
      currentCourse.availableSlots.length === 0
    )
      return;

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
    setCurrentCourse({ courseCode: "", availableSlots: [] });
    courseForm.reset();
  };

  const removeCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const removeTimeSlot = (index: number) => {
    setCurrentCourse((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((_, i) => i !== index),
    }));
  };

  const updateCurrentCourseCode = (courseCode: string) => {
    setCurrentCourse((prev) => ({ ...prev, courseCode }));
  };

  const resetCourses = () => {
    setCourses([]);
    setCurrentCourse({ courseCode: "", availableSlots: [] });
  };

  return {
    courses,
    currentCourse,
    onCourseSubmit,
    onTimeSlotSubmit,
    addCourse,
    removeCourse,
    removeTimeSlot,
    updateCurrentCourseCode,
    resetCourses,
  };
};
