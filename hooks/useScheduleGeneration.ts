import { useState } from "react";
import { Course, GeneratedSchedule } from "../types/scheduler";
import { generateSchedule } from "../algorithms/scheduler";

export const useScheduleGeneration = (courses: Course[]) => {
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);

  const handleGenerateSchedule = () => {
    if (courses.length === 0) return;

    const result = generateSchedule(courses);
    setGeneratedSchedule(result);

    // Note: Image auto-download is now handled in ScheduleDisplay component
    // via useEffect when generatedSchedule changes
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
