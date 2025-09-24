import { useState, useEffect } from "react";
import { Course, GeneratedSchedule } from "../types/scheduler";
import { generateSchedule } from "../algorithms/scheduler";
import { useLocalStorage } from "./useLocalStorage";

export const useScheduleGeneration = (courses: Course[]) => {
  const { loadGeneratedSchedule, saveGeneratedSchedule, removeFromStorage } = useLocalStorage();
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);

  // Load saved schedule on initialization
  useEffect(() => {
    const savedSchedule = loadGeneratedSchedule();
    if (savedSchedule) {
      setGeneratedSchedule(savedSchedule);
    }
  }, [loadGeneratedSchedule]);

  // Save schedule to local storage whenever it changes
  useEffect(() => {
    if (generatedSchedule) {
      saveGeneratedSchedule(generatedSchedule);
    }
  }, [generatedSchedule, saveGeneratedSchedule]);

  const handleGenerateSchedule = () => {
    if (courses.length === 0) return;

    const result = generateSchedule(courses);
    setGeneratedSchedule(result);

    // Note: Image auto-download is now handled in ScheduleDisplay component
    // via useEffect when generatedSchedule changes
  };

  const resetSchedule = () => {
    setGeneratedSchedule(null);
    // Clear schedule from local storage when resetting
    removeFromStorage("sched-smart-generated-schedule");
  };

  return {
    generatedSchedule,
    handleGenerateSchedule,
    resetSchedule,
  };
};
