// types/scheduler.ts - Updated with dependencies

export interface TimeSlot {
  days: string[];
  startTime: string;
  endTime: string;
}

// New dependency interface
export interface ActivityDependency {
  activityCode: string;
  slotIndex: number;
  dependentActivityCode: string;
  dependentSlotIndex: number;
}

export interface Activity {
  activityCode: string;
  availableSlots: TimeSlot[];
  dependencies?: ActivityDependency[]; // Optional dependencies for this activity
}

export interface ScheduleSlot {
  activityCode: string;
  days: string[];
  startTime: string;
  endTime: string;
  slotIndex: number;
}

export interface GeneratedSchedule {
  schedule: ScheduleSlot[];
  conflicts: string[];
  totalActivities: number;
  scheduledActivities: number;
  algorithm: "backtracking";
  generatedAt: string;
  dependencyViolations?: string[]; // Track dependency issues
}

export interface DayPreset {
  label: string;
  days: string[];
}

// Form types
export interface ActivityFormData {
  activityCode: string;
}

export interface TimeSlotFormData {
  days: string[];
  startTime: string;
  endTime: string;
}

// New dependency form type
export interface DependencyFormData {
  dependentActivityCode: string;
  dependentSlotIndex: number;
}
