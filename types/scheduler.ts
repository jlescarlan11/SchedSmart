export interface TimeSlot {
  days: string[];
  startTime: string;
  endTime: string;
}

export interface Course {
  courseCode: string;
  availableSlots: TimeSlot[];
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
  algorithm: "backtracking" | "greedy";
  generatedAt: string;
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
