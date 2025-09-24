import { useState, useEffect, useCallback } from "react";
import { Activity, GeneratedSchedule } from "@/types/scheduler";
import { useHydrationSafe } from "./useHydrationSafe";

const STORAGE_KEYS = {
  ACTIVITIES: "sched-smart-activities",
  GENERATED_SCHEDULE: "sched-smart-generated-schedule",
} as const;

/**
 * Consolidated state management hook
 * Replaces: useActivityState, useLocalStorage, useScheduleGeneration
 */
export const useSchedulerState = () => {
  const isClient = useHydrationSafe();
  
  // Core state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>({
    activityCode: "",
    availableSlots: [],
    dependencies: [],
  });
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [generatedSchedule, setGeneratedSchedule] = useState<GeneratedSchedule | null>(null);
  const [isNewlyGenerated, setIsNewlyGenerated] = useState(false);

  // Local storage functions
  const saveToStorage = useCallback(<T>(key: string, data: T): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.warn(`Failed to save data to localStorage for key: ${key}`, error);
    }
  }, []);

  const loadFromStorage = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        if (item) {
          return JSON.parse(item) as T;
        }
      }
    } catch (error) {
      console.warn(`Failed to load data from localStorage for key: ${key}`, error);
    }
    return defaultValue;
  }, []);

  const removeFromStorage = useCallback((key: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to remove data from localStorage for key: ${key}`, error);
    }
  }, []);

  // Load activities from local storage on initialization
  useEffect(() => {
    if (isClient) {
      const savedActivities = loadFromStorage(STORAGE_KEYS.ACTIVITIES, [] as Activity[]);
      if (savedActivities.length > 0) {
        setActivities(savedActivities);
      }
    }
  }, [isClient, loadFromStorage]);

  // Save activities to local storage whenever activities change
  useEffect(() => {
    if (isClient && activities.length > 0) {
      saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    }
  }, [activities, saveToStorage, isClient]);

  // Load saved schedule on initialization
  useEffect(() => {
    if (isClient) {
      const savedSchedule = loadFromStorage(STORAGE_KEYS.GENERATED_SCHEDULE, null as GeneratedSchedule | null);
      if (savedSchedule) {
        setGeneratedSchedule(savedSchedule);
        setIsNewlyGenerated(false);
      }
    }
  }, [isClient, loadFromStorage]);

  // Save schedule to local storage whenever it changes
  useEffect(() => {
    if (isClient && generatedSchedule) {
      saveToStorage(STORAGE_KEYS.GENERATED_SCHEDULE, generatedSchedule);
    }
  }, [generatedSchedule, saveToStorage, isClient]);

  // Reset functions
  const resetCurrentActivity = useCallback(() => {
    setCurrentActivity({
      activityCode: "",
      availableSlots: [],
      dependencies: [],
    });
    setCurrentSlotIndex(null);
  }, []);

  const resetAllActivities = useCallback(() => {
    setActivities([]);
    setEditingActivityIndex(null);
    resetCurrentActivity();
    if (isClient) {
      saveToStorage(STORAGE_KEYS.ACTIVITIES, []);
    }
  }, [resetCurrentActivity, saveToStorage, isClient]);

  const resetSchedule = useCallback(() => {
    setGeneratedSchedule(null);
    setIsNewlyGenerated(false);
    if (isClient) {
      removeFromStorage(STORAGE_KEYS.GENERATED_SCHEDULE);
    }
  }, [removeFromStorage, isClient]);

  const clearAllData = useCallback(() => {
    if (isClient) {
      removeFromStorage(STORAGE_KEYS.ACTIVITIES);
      removeFromStorage(STORAGE_KEYS.GENERATED_SCHEDULE);
    }
    resetAllActivities();
    resetSchedule();
  }, [removeFromStorage, resetAllActivities, resetSchedule, isClient]);

  const hasSavedData = useCallback((): boolean => {
    if (!isClient) return false;
    
    return Boolean(
      localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || 
      localStorage.getItem(STORAGE_KEYS.GENERATED_SCHEDULE)
    );
  }, [isClient]);

  // Computed values
  const canAddActivity = Boolean(
    currentActivity.activityCode.trim() &&
    currentActivity.availableSlots.length > 0
  );
  const canGenerateSchedule = activities.length > 0;
  const hasData = activities.length > 0 || Boolean(generatedSchedule);

  return {
    // State
    activities,
    currentActivity,
    currentSlotIndex,
    editingActivityIndex,
    selectedDays,
    generatedSchedule,
    isNewlyGenerated,
    hasData,
    canAddActivity,
    canGenerateSchedule,

    // Setters
    setActivities,
    setCurrentActivity,
    setCurrentSlotIndex,
    setEditingActivityIndex,
    setSelectedDays,
    setGeneratedSchedule,
    setIsNewlyGenerated,

    // Storage functions
    saveToStorage,
    loadFromStorage,
    removeFromStorage,

    // Reset functions
    resetCurrentActivity,
    resetAllActivities,
    resetSchedule,
    clearAllData,
    hasSavedData,
  };
};
