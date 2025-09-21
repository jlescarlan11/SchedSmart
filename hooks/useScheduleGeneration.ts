import { useState } from "react";
import { Course, GeneratedSchedule } from "../types/scheduler";
import { generateSchedule } from "../utils/scheduler";

export const useScheduleGeneration = (courses: Course[]) => {
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);

  const handleGenerateSchedule = () => {
    if (courses.length === 0) return;
    const result = generateSchedule(courses, "backtracking");
    setGeneratedSchedule(result);
  };

  const resetSchedule = () => {
    setGeneratedSchedule(null);
  };

  return {
    generatedSchedule,
    handleGenerateSchedule,
    resetSchedule,
  };
};
