"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { Activity, GeneratedSchedule, ActivityFormData, TimeSlotFormData, DependencyFormData } from "@/types/scheduler";
import { StepFlowState } from "@/hooks/useStepFlow";

export interface SchedulerContextType {
  // State
  activities: Activity[];
  currentActivity: Activity;
  currentSlotIndex: number | null;
  editingActivityIndex: number | null;
  selectedDays: string[];
  generatedSchedule: GeneratedSchedule | null;
  isNewlyGenerated: boolean;
  hasData: boolean;
  canAddActivity: boolean;
  canGenerateSchedule: boolean;

  // Forms
  activityForm: UseFormReturn<ActivityFormData>;
  timeSlotForm: UseFormReturn<TimeSlotFormData>;
  dependencyForm: UseFormReturn<DependencyFormData>;

  // Step flow
  stepFlow: StepFlowState;

  // Day handlers
  dayHandlers: {
    handleDayToggle: (day: string) => void;
    handlePresetSelect: (days: string[]) => void;
    isPresetSelected: (days: string[]) => boolean;
    resetDays: () => void;
  };

  // Activity handlers
  activityHandlers: {
    onActivitySubmit: (data: ActivityFormData) => void;
    onTimeSlotSubmit: (data: TimeSlotFormData) => void;
    onDependencySubmit: (data: DependencyFormData) => void;
    updateCurrentActivityCode: (code: string) => void;
    addActivity: () => void;
    removeActivity: (index: number) => void;
    editActivity: (index: number) => void;
    cancelEdit: () => void;
    removeTimeSlot: (index: number) => void;
    selectSlotForDependencies: (index: number) => void;
    removeDependency: (index: number) => void;
    resetActivities: () => void;
  };

  // Schedule handlers
  scheduleHandlers: {
    handleGenerateSchedule: () => void;
    resetScheduler: () => void;
    clearSavedData: () => void;
  };
}

const SchedulerContext = createContext<SchedulerContextType | null>(null);

export const useSchedulerContext = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useSchedulerContext must be used within a SchedulerProvider");
  }
  return context;
};

interface SchedulerProviderProps {
  children: ReactNode;
  value: SchedulerContextType;
}

export const SchedulerProvider: React.FC<SchedulerProviderProps> = ({ children, value }) => {
  return (
    <SchedulerContext.Provider value={value}>
      {children}
    </SchedulerContext.Provider>
  );
};
