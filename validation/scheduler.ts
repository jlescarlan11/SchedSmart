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

export const activitySchema = z.object({
  activityCode: z
    .string()
    .min(1, "Activity code is required")
    .max(20, "Activity code must be 20 characters or less")
    .regex(
      /^[A-Za-z0-9\s-_]+$/,
      "Activity code can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});

// New dependency validation schema
export const dependencySchema = z.object({
  dependentActivityCode: z.string().min(1, "Dependent activity is required"),
  dependentSlotIndex: z
    .number()
    .min(0, "Slot index must be non-negative")
    .int("Slot index must be a whole number"),
});

// Export inferred types
export type TimeSlotFormData = z.infer<typeof timeSlotSchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
export type DependencyFormData = z.infer<typeof dependencySchema>;
