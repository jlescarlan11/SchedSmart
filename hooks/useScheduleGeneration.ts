import { useState } from "react";
import { Course, GeneratedSchedule } from "../types/scheduler";
import { generateSchedule } from "../algorithms/scheduler";

export const useScheduleGeneration = (courses: Course[]) => {
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSchedule = async () => {
    if (courses.length === 0) return;

    setIsGenerating(true);
    try {
      // Add a small delay to show loading state for complex schedules
      await new Promise((resolve) => setTimeout(resolve, 100));
      const result = generateSchedule(courses);
      setGeneratedSchedule(result);
    } catch (error) {
      console.error("Error generating schedule:", error);
      // You might want to show an error toast here
    } finally {
      setIsGenerating(false);
    }
  };

  const resetSchedule = () => {
    setGeneratedSchedule(null);
  };

  return {
    generatedSchedule,
    isGenerating,
    handleGenerateSchedule,
    resetSchedule,
  };
};
