// types/scheduler.ts - Updated with dependencies

export interface TimeSlot {
  days: string[];
  startTime: string;
  endTime: string;
}

// New dependency interface
export interface CourseDependency {
  courseCode: string;
  slotIndex: number;
  dependentCourseCode: string;
  dependentSlotIndex: number;
}

export interface Course {
  courseCode: string;
  availableSlots: TimeSlot[];
  dependencies?: CourseDependency[]; // Optional dependencies for this course
}

export interface ScheduleSlot {
  courseCode: string;
  days: string[];
  startTime: string;
  endTime: string;
  slotIndex: number;
}

export interface GeneratedSchedule {
  schedule: ScheduleSlot[];
  conflicts: string[];
  totalCourses: number;
  scheduledCourses: number;
  algorithm: "backtracking";
  generatedAt: string;
  dependencyViolations?: string[]; // Track dependency issues
}

export interface DayPreset {
  label: string;
  days: string[];
}

// Form types
export interface CourseFormData {
  courseCode: string;
}

export interface TimeSlotFormData {
  days: string[];
  startTime: string;
  endTime: string;
}

// New dependency form type
export interface DependencyFormData {
  dependentCourseCode: string;
  dependentSlotIndex: number;
}
