// validation/scheduler.ts

import * as z from "zod";

export const timeSlotSchema = z.object({
  days: z
    .array(z.string())
    .min(1, "Select at least one day")
    .max(6, "Cannot select more than 6 days"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export const courseSchema = z.object({
  courseCode: z
    .string()
    .min(1, "Course code is required")
    .max(20, "Course code must be 20 characters or less")
    .regex(
      /^[A-Za-z0-9\s-_]+$/,
      "Course code can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});

// New dependency validation schema
export const dependencySchema = z.object({
  dependentCourseCode: z.string().min(1, "Dependent course is required"),
  dependentSlotIndex: z
    .number()
    .min(0, "Slot index must be non-negative")
    .int("Slot index must be a whole number"),
});

// Export inferred types
export type TimeSlotFormData = z.infer<typeof timeSlotSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type DependencyFormData = z.infer<typeof dependencySchema>;
