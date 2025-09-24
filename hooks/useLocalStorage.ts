import { useCallback } from "react";
import { useHydrationSafe } from "./useHydrationSafe";
import type { Course, GeneratedSchedule } from "../types/scheduler";

const STORAGE_KEYS = {
  COURSES: "sched-smart-courses",
  GENERATED_SCHEDULE: "sched-smart-generated-schedule",
} as const;

/**
 * Custom hook for managing local storage operations for the scheduler
 */
export const useLocalStorage = () => {
  // Use hydration-safe hook to prevent mismatches
  const isClient = useHydrationSafe();
  // Generic function to save data to localStorage
  const saveToStorage = useCallback(<T>(key: string, data: T): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.warn(`Failed to save data to localStorage for key: ${key}`, error);
    }
  }, []);

  // Generic function to load data from localStorage
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

  // Generic function to remove data from localStorage
  const removeFromStorage = useCallback((key: string): void => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to remove data from localStorage for key: ${key}`, error);
    }
  }, []);

  // Specific functions for courses
  const saveCourses = useCallback((courses: Course[]): void => {
    saveToStorage(STORAGE_KEYS.COURSES, courses);
  }, [saveToStorage]);

  const loadCourses = useCallback((): Course[] => {
    return loadFromStorage(STORAGE_KEYS.COURSES, [] as Course[]);
  }, [loadFromStorage]);

  // Specific functions for generated schedule
  const saveGeneratedSchedule = useCallback((schedule: GeneratedSchedule): void => {
    saveToStorage(STORAGE_KEYS.GENERATED_SCHEDULE, schedule);
  }, [saveToStorage]);

  const loadGeneratedSchedule = useCallback((): GeneratedSchedule | null => {
    return loadFromStorage(STORAGE_KEYS.GENERATED_SCHEDULE, null as GeneratedSchedule | null);
  }, [loadFromStorage]);

  // Function to clear all stored data
  const clearAllData = useCallback((): void => {
    removeFromStorage(STORAGE_KEYS.COURSES);
    removeFromStorage(STORAGE_KEYS.GENERATED_SCHEDULE);
  }, [removeFromStorage]);

  // Function to check if there's any saved data
  const hasSavedData = useCallback((): boolean => {
    // Always return false during SSR to prevent hydration mismatches
    if (!isClient) return false;
    
    return Boolean(
      localStorage.getItem(STORAGE_KEYS.COURSES) || 
      localStorage.getItem(STORAGE_KEYS.GENERATED_SCHEDULE)
    );
  }, [isClient]);

  return {
    // Generic functions
    saveToStorage,
    loadFromStorage,
    removeFromStorage,
    
    // Course-specific functions
    saveCourses,
    loadCourses,
    
    // Schedule-specific functions
    saveGeneratedSchedule,
    loadGeneratedSchedule,
    
    // Utility functions
    clearAllData,
    hasSavedData,
  };
};
