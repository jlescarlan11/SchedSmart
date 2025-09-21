import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TimeSlotFormData } from "../types/scheduler";

export const useDaySelection = (
  timeSlotForm: UseFormReturn<TimeSlotFormData>
) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleDayToggle = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    timeSlotForm.setValue("days", newDays);
  };

  const handlePresetSelect = (presetDays: string[]) => {
    setSelectedDays(presetDays);
    timeSlotForm.setValue("days", presetDays);
  };

  const isPresetSelected = (presetDays: string[]): boolean =>
    JSON.stringify(selectedDays.sort()) === JSON.stringify(presetDays.sort());

  const resetDays = () => setSelectedDays([]);

  return {
    selectedDays,
    handleDayToggle,
    handlePresetSelect,
    isPresetSelected,
    resetDays,
  };
};
