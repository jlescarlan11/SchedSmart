"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X, Calendar, Clock, BookOpen, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Col2, Col3, Grid } from "@/components/layout/grid";

// Types
interface TimeSlot {
  days: string[];
  startTime: string;
  endTime: string;
}

interface Course {
  courseCode: string;
  availableSlots: TimeSlot[];
}

interface ScheduleSlot {
  courseCode: string;
  days: string[];
  startTime: string;
  endTime: string;
  slotIndex: number;
}

interface GeneratedSchedule {
  schedule: ScheduleSlot[];
  conflicts: string[];
  totalCourses: number;
  scheduledCourses: number;
}

// Form schemas
const timeSlotSchema = z.object({
  days: z.array(z.string()).min(1, "Select at least one day"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

const courseSchema = z.object({
  courseCode: z.string().min(1, "Course code is required"),
});

type TimeSlotFormData = z.infer<typeof timeSlotSchema>;
type CourseFormData = z.infer<typeof courseSchema>;

const SchedulerSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course>({
    courseCode: "",
    availableSlots: [],
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);

  // Constants
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeOptions = [
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
  ];

  const dayPresets = [
    { label: "MW", days: ["Monday", "Wednesday"] },
    { label: "TR", days: ["Tuesday", "Thursday"] },
    { label: "WF", days: ["Wednesday", "Friday"] },
    { label: "MWF", days: ["Monday", "Wednesday", "Friday"] },
    { label: "TRF", days: ["Tuesday", "Thursday", "Friday"] },
    {
      label: "MTWRF",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  ];

  // Forms
  const courseForm = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { courseCode: "" },
  });

  const timeSlotForm = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: { days: [], startTime: "", endTime: "" },
  });

  // Utility functions
  const convertTo24Hour = (time12h: string): number => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = String(parseInt(hours, 10) + 12);
    return parseInt(hours) + parseInt(minutes) / 60;
  };

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

  const isPresetSelected = (presetDays: string[]): boolean => {
    return (
      JSON.stringify(selectedDays.sort()) === JSON.stringify(presetDays.sort())
    );
  };

  // Schedule generation logic
  const checkTimeConflict = (
    slot1: ScheduleSlot,
    slot2: ScheduleSlot
  ): boolean => {
    // Check if there's any day overlap
    const dayOverlap = slot1.days.some((day) => slot2.days.includes(day));
    if (!dayOverlap) return false;

    // Check time overlap
    const start1 = convertTo24Hour(slot1.startTime);
    const end1 = convertTo24Hour(slot1.endTime);
    const start2 = convertTo24Hour(slot2.startTime);
    const end2 = convertTo24Hour(slot2.endTime);

    return start1 < end2 && start2 < end1;
  };

  // Backtracking algorithm for optimal schedule generation
  const generateScheduleBacktracking = (): GeneratedSchedule => {
    let bestSchedule: ScheduleSlot[] = [];
    let bestCount = 0;

    const backtrack = (
      courseIndex: number,
      currentSchedule: ScheduleSlot[]
    ): void => {
      // Base case: processed all courses
      if (courseIndex === courses.length) {
        if (currentSchedule.length > bestCount) {
          bestCount = currentSchedule.length;
          bestSchedule = [...currentSchedule];
        }
        return;
      }

      const course = courses[courseIndex];

      // Try each available slot for this course
      for (
        let slotIndex = 0;
        slotIndex < course.availableSlots.length;
        slotIndex++
      ) {
        const slot = course.availableSlots[slotIndex];
        const potentialSlot: ScheduleSlot = {
          courseCode: course.courseCode,
          days: slot.days,
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotIndex: slotIndex,
        };

        // Check if this slot conflicts with any in current schedule
        const hasConflict = currentSchedule.some((existingSlot) =>
          checkTimeConflict(potentialSlot, existingSlot)
        );

        if (!hasConflict) {
          // Add this slot and recurse
          currentSchedule.push(potentialSlot);
          backtrack(courseIndex + 1, currentSchedule);
          currentSchedule.pop(); // Backtrack
        }
      }

      // Also try skipping this course (explore not scheduling it)
      backtrack(courseIndex + 1, currentSchedule);
    };

    // Start backtracking
    backtrack(0, []);

    // Generate conflicts list
    const scheduledCourses = new Set(
      bestSchedule.map((slot) => slot.courseCode)
    );
    const conflicts = courses
      .filter((course) => !scheduledCourses.has(course.courseCode))
      .map(
        (course) =>
          `Could not schedule ${course.courseCode} in optimal solution`
      );

    return {
      schedule: bestSchedule,
      conflicts,
      totalCourses: courses.length,
      scheduledCourses: bestSchedule.length,
    };
  };

  // Greedy algorithm (faster but may not be optimal)
  const generateScheduleGreedy = (): GeneratedSchedule => {
    const schedule: ScheduleSlot[] = [];
    const conflicts: string[] = [];

    // Greedy approach - process courses in order
    for (const course of courses) {
      let slotAdded = false;

      for (
        let slotIndex = 0;
        slotIndex < course.availableSlots.length;
        slotIndex++
      ) {
        const slot = course.availableSlots[slotIndex];
        const potentialSlot: ScheduleSlot = {
          courseCode: course.courseCode,
          days: slot.days,
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotIndex: slotIndex,
        };

        // Check for conflicts with already scheduled courses
        const hasConflict = schedule.some((existingSlot) =>
          checkTimeConflict(potentialSlot, existingSlot)
        );

        if (!hasConflict) {
          schedule.push(potentialSlot);
          slotAdded = true;
          break;
        }
      }

      if (!slotAdded) {
        conflicts.push(
          `Could not schedule ${course.courseCode} - all time slots conflict with existing courses`
        );
      }
    }

    return {
      schedule,
      conflicts,
      totalCourses: courses.length,
      scheduledCourses: schedule.length,
    };
  };

  // Main schedule generation function
  const generateSchedule = (): GeneratedSchedule => {
    // Use backtracking for optimal results (slower for large inputs)
    // Use greedy for faster results (may not be optimal)

    if (courses.length <= 10) {
      // Use backtracking for smaller problems
      return generateScheduleBacktracking();
    } else {
      // Use greedy for larger problems
      return generateScheduleGreedy();
    }
  };

  const handleGenerateSchedule = () => {
    const result = generateSchedule();
    setGeneratedSchedule(result);

    // Log the JSON to console
    console.log("Generated Schedule JSON:", JSON.stringify(result, null, 2));

    // You can also download the JSON file
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Form handlers
  const onCourseSubmit = (data: CourseFormData) => {
    setCurrentCourse((prev) => ({ ...prev, courseCode: data.courseCode }));
  };

  const onTimeSlotSubmit = (data: TimeSlotFormData) => {
    const startHour = convertTo24Hour(data.startTime);
    const endHour = convertTo24Hour(data.endTime);

    if (endHour <= startHour) {
      timeSlotForm.setError("endTime", {
        message: "End time must be after start time",
      });
      return;
    }

    const newSlot: TimeSlot = {
      days: data.days,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    setCurrentCourse((prev) => ({
      ...prev,
      availableSlots: [...prev.availableSlots, newSlot],
    }));

    // Reset form and selected days
    timeSlotForm.reset();
    setSelectedDays([]);
  };

  const removeTimeSlot = (index: number) => {
    setCurrentCourse((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((_, i) => i !== index),
    }));
  };

  const addCourse = () => {
    if (currentCourse.courseCode && currentCourse.availableSlots.length > 0) {
      setCourses((prev) => [...prev, { ...currentCourse }]);
      setCurrentCourse({ courseCode: "", availableSlots: [] });
      courseForm.reset();
    }
  };

  const removeCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="section-spacing">
      <Grid>
        <Col2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Course Scheduler</h1>
            </div>

            {/* Course Input Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Add New Course
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...courseForm}>
                  <form
                    onSubmit={courseForm.handleSubmit(onCourseSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={courseForm.control}
                      name="courseCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., CS101, MATH201"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setCurrentCourse((prev) => ({
                                  ...prev,
                                  courseCode: e.target.value,
                                }));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>

                <Separator />

                {/* Time Slot Input */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4" />
                    <h3 className="font-semibold">Add Time Slot Option</h3>
                  </div>

                  <Form {...timeSlotForm}>
                    <form
                      onSubmit={timeSlotForm.handleSubmit(onTimeSlotSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={timeSlotForm.control}
                        name="days"
                        render={() => (
                          <FormItem>
                            <FormLabel>Days</FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                {/* Preset Combinations */}
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Common Combinations:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {dayPresets.map((preset) => (
                                      <Button
                                        key={preset.label}
                                        type="button"
                                        variant={
                                          isPresetSelected(preset.days)
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                          handlePresetSelect(preset.days)
                                        }
                                      >
                                        {preset.label}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                {/* Individual Day Toggles */}
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Or select individual days:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map((day) => (
                                      <Button
                                        key={day}
                                        type="button"
                                        variant={
                                          selectedDays.includes(day)
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => handleDayToggle(day)}
                                      >
                                        {day.slice(0, 3)}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={timeSlotForm.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select start time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={timeSlotForm.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select end time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Time Slot
                      </Button>
                    </form>
                  </Form>
                </div>

                {/* Display Added Time Slots */}
                <AnimatePresence>
                  {currentCourse.availableSlots.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-medium mb-3">Time Slot Options:</h4>
                      <div className="space-y-2">
                        {currentCourse.availableSlots.map((slot, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between bg-accent p-3 rounded-lg"
                          >
                            <div className="flex flex-wrap gap-1">
                              {slot.days.map((day) => (
                                <Badge
                                  key={day}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {day.slice(0, 3)}
                                </Badge>
                              ))}
                              <span className="text-sm font-medium ml-2">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={addCourse}
                  disabled={
                    !currentCourse.courseCode ||
                    currentCourse.availableSlots.length === 0
                  }
                  className="w-full"
                  size="lg"
                >
                  Add Course
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Col2>

        <Col3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Added Courses List */}
            <AnimatePresence>
              {courses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Added Courses</h2>
                  <div className="space-y-4">
                    {courses.map((course, courseIndex) => (
                      <motion.div
                        key={courseIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: courseIndex * 0.1 }}
                      >
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                {course.courseCode}
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCourse(courseIndex)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {course.availableSlots.map((slot, slotIndex) => (
                                <div
                                  key={slotIndex}
                                  className="p-3 bg-accent rounded-lg"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">
                                      Option {slotIndex + 1}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {slot.startTime} - {slot.endTime}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {slot.days.map((day) => (
                                      <Badge
                                        key={day}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {day}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={handleGenerateSchedule}
                      size="lg"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate Schedule (JSON)
                    </Button>
                  </motion.div>

                  {/* Display Generated Schedule */}
                  <AnimatePresence>
                    {generatedSchedule && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Generated Schedule
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {generatedSchedule.scheduledCourses} of{" "}
                              {generatedSchedule.totalCourses} courses scheduled
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {generatedSchedule.schedule.map((slot, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                                >
                                  <div className="font-medium">
                                    {slot.courseCode}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {slot.startTime} - {slot.endTime}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {slot.days.map((day) => (
                                      <Badge
                                        key={day}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {day.slice(0, 3)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              {generatedSchedule.conflicts.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="font-medium text-red-600 mb-2">
                                    Conflicts:
                                  </h4>
                                  {generatedSchedule.conflicts.map(
                                    (conflict, index) => (
                                      <div
                                        key={index}
                                        className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                                      >
                                        {conflict}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-medium mb-2">JSON Output:</h4>
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(generatedSchedule, null, 2)}
                              </pre>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Col3>
      </Grid>
    </div>
  );
};

export default SchedulerSection;
