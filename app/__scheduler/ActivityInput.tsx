"use client";

import React, { useMemo } from "react";
import {
  BookOpen,
  Clock,
  Plus,
  Save,
  RefreshCw,
  X,
  Link,
  Trash2,
  Database,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnly } from "@/components/ui/client-only";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { TimeSlotSelector } from "./TimeSlotSelector";
import { TimeSlotList } from "./time-slots/TimeSlotList";
import type {
  CourseFormData,
  TimeSlotFormData,
  DependencyFormData,
  TimeSlot,
  Course,
} from "@/types/scheduler";
import { formatSlot } from "@/utils";

interface DayHandlers {
  handleDayToggle: (day: string) => void;
  handlePresetSelect: (days: string[]) => void;
  isPresetSelected: (days: string[]) => boolean;
}

interface CourseHandlers {
  selectSlotForDependencies: (index: number) => void;
}

interface ActivityInputProps {
  // Forms
  courseForm: UseFormReturn<CourseFormData>;
  timeSlotForm: UseFormReturn<TimeSlotFormData>;
  dependencyForm: UseFormReturn<DependencyFormData>;

  // State
  selectedDays: string[];
  timeSlots: TimeSlot[];
  currentCourse: Course;
  courses: Course[];
  editingCourseIndex?: number | null;
  currentSlotIndex: number | null;
  canAddCourse: boolean;
  hasData: boolean;

  // Handlers
  onCourseSubmit: (data: CourseFormData) => void;
  onTimeSlotSubmit: (data: TimeSlotFormData) => void;
  onDependencySubmit: (data: DependencyFormData) => void;
  onCodeChange: (code: string) => void;
  onRemoveSlot: (index: number) => void;
  onRemoveDependency: (index: number) => void;
  onAddCourse: () => void;
  onCancelEdit?: () => void;
  onReset: () => void;
  onClearSavedData?: () => void;
  hasSavedData?: boolean;
  dayHandlers: DayHandlers;
  courseHandlers: CourseHandlers;
}

export const ActivityInput: React.FC<ActivityInputProps> = ({
  courseForm,
  timeSlotForm,
  dependencyForm,
  selectedDays,
  timeSlots,
  currentCourse,
  courses,
  editingCourseIndex,
  currentSlotIndex,
  canAddCourse,
  hasData,
  onCourseSubmit,
  onTimeSlotSubmit,
  onDependencySubmit,
  onCodeChange,
  onRemoveSlot,
  onRemoveDependency,
  onAddCourse,
  onCancelEdit,
  onReset,
  onClearSavedData,
  hasSavedData,
  dayHandlers,
  courseHandlers,
}) => {
  const isEditing = editingCourseIndex !== null;

  // Memoized calculations for dependency functionality
  const { availableCourses, currentSlotDependencies, selectedCourse } =
    useMemo(() => {
      const available = courses.filter(
        (c) => c.courseCode !== currentCourse.courseCode
      );

      const selectedCourseCode = dependencyForm.watch("dependentCourseCode");
      const selected = courses.find((c) => c.courseCode === selectedCourseCode);

      // Get dependencies for current course and slot
      const dependencies =
        currentCourse.dependencies?.filter(
          (dep) =>
            dep.courseCode === currentCourse.courseCode &&
            dep.slotIndex === currentSlotIndex
        ) ?? [];

      return {
        availableCourses: available,
        currentSlotDependencies: dependencies,
        selectedCourse: selected,
      };
    }, [courses, currentCourse, currentSlotIndex, dependencyForm.watch]);

  const handleCourseChange = (courseCode: string) => {
    dependencyForm.setValue("dependentCourseCode", courseCode);
    dependencyForm.resetField("dependentSlotIndex");
  };

  const handleSlotChange = (slotValue: string) => {
    const slotIndex = parseInt(slotValue, 10);
    if (!isNaN(slotIndex)) {
      dependencyForm.setValue("dependentSlotIndex", slotIndex);
    }
  };

  return (
    <div className="space-y-4">
      {/* Combined Course Input Card */}
      <Card className="border-border/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap">
            <CardTitle className="flex items-center gap-3 text-lg font-medium">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              Activity Information
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
              {hasData && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={hasSavedData && onClearSavedData ? onClearSavedData : onReset}
                  className="flex items-center gap-2 text-muted-foreground hover:text-destructive"
                  title={
                    hasSavedData 
                      ? "Clear all saved data and reset everything" 
                      : "Reset all courses and start over"
                  }
                >
                  {hasSavedData ? (
                    <>
                      <Database className="h-4 w-4" />
                      Clear & Reset
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Reset All
                    </>
                  )}
                </Button>
              )}
              {isEditing && (
                <>
                  <Badge variant="secondary">Editing Mode</Badge>
                  {onCancelEdit && (
                    <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-0">
          {/* Course Code Section */}
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
                    <FormLabel>Activity Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Meeting-A, Workshop-101"
                        className="uppercase"
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                          onCodeChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Divider */}
          <Separator className="my-6" />
          <div className="pt-0">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h3 className="font-medium">Time Slots</h3>
            </div>

            {/* Time Slot Section */}
            <Form {...timeSlotForm}>
              <form
                onSubmit={timeSlotForm.handleSubmit(onTimeSlotSubmit)}
                className="space-y-4"
              >
                <TimeSlotSelector
                  form={timeSlotForm}
                  selectedDays={selectedDays}
                  handleDayToggle={dayHandlers.handleDayToggle}
                  handlePresetSelect={dayHandlers.handlePresetSelect}
                  isPresetSelected={dayHandlers.isPresetSelected}
                />
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </form>
            </Form>

            {/* Time Slot List */}
            <div className="mt-4">
              <TimeSlotList
                slots={timeSlots}
                onRemoveSlot={onRemoveSlot}
                onSelectSlot={courseHandlers.selectSlotForDependencies}
                selectedSlotIndex={currentSlotIndex}
                variant="interactive"
              />
            </div>
          </div>

          {/* Divider for Dependencies */}
          <Separator className="my-6" />
          <div className="pt-0">
            <div className="flex items-center gap-2 mb-4">
              <Link className="h-5 w-5" />
              <h3 className="font-medium">Activity Dependencies</h3>
            </div>

            {/* Dependencies Section */}
            {currentSlotIndex === null ? (
              <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                Add a time slot first, then select it to configure dependencies.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                  Configure which activities must be scheduled together with{" "}
                  <Badge variant="outline">{currentCourse.courseCode}</Badge>{" "}
                  slot {currentSlotIndex + 1}:
                  <br />
                  <span className="text-xs">
                    {currentCourse.availableSlots[currentSlotIndex]
                      ? formatSlot(
                          currentCourse.availableSlots[currentSlotIndex]
                        )
                      : "Invalid slot - please refresh and try again"}
                  </span>
                </div>

                {/* Debug info for development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded border">
                    <strong>Debug:</strong> Current slot: {currentSlotIndex}, 
                    Available courses: {availableCourses.length}, 
                    Selected course: {selectedCourse?.courseCode || 'None'}
                  </div>
                )}

                {/* Add Dependency Form */}
                {availableCourses.length > 0 ? (
                  <Form {...dependencyForm}>
                    <form
                      onSubmit={dependencyForm.handleSubmit(onDependencySubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={dependencyForm.control}
                          name="dependentCourseCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dependent Activity</FormLabel>
                              <Select
                                onValueChange={handleCourseChange}
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select activity" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableCourses.map((course) => (
                                    <SelectItem
                                      key={course.courseCode}
                                      value={course.courseCode}
                                    >
                                      {course.courseCode}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={dependencyForm.control}
                          name="dependentSlotIndex"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dependent Time Slot</FormLabel>
                              <Select
                                onValueChange={handleSlotChange}
                                value={field.value?.toString() ?? ""}
                                disabled={!selectedCourse}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select slot" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {selectedCourse?.availableSlots.map(
                                    (slot, index) => (
                                      <SelectItem
                                        key={index}
                                        value={index.toString()}
                                      >
                                        Slot {index + 1}: {formatSlot(slot)}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="sm"
                        disabled={
                          !selectedCourse ||
                          dependencyForm.watch("dependentSlotIndex") ===
                            undefined
                        }
                        title={
                          !selectedCourse
                            ? "Please select a dependent activity first"
                            : dependencyForm.watch("dependentSlotIndex") === undefined
                            ? "Please select a time slot for the dependent activity"
                            : "Add this dependency"
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Dependency
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                    No other activities available. Add more activities to create
                    dependencies.
                  </div>
                )}

                {/* Current Dependencies */}
                {currentSlotDependencies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      Current Dependencies ({currentSlotDependencies.length}):
                    </h4>
                    <div className="space-y-2">
                      {currentSlotDependencies.map((dependency, index) => {
                        const depCourse = courses.find(
                          (c) => c.courseCode === dependency.dependentCourseCode
                        );

                        return (
                          <div
                            key={`${dependency.dependentCourseCode}-${dependency.dependentSlotIndex}`}
                            className="flex items-center justify-between p-3 bg-muted rounded-md"
                          >
                            <div className="text-sm">
                              <Badge variant="secondary" className="mr-2">
                                {dependency.dependentCourseCode}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Slot {dependency.dependentSlotIndex + 1}:
                              </span>
                              <br />
                              <span className="text-xs">
                                {depCourse
                                  ? formatSlot(
                                      depCourse.availableSlots[
                                        dependency.dependentSlotIndex
                                      ]
                                    )
                                  : "Course not found"}
                              </span>
                            </div>
                            <Button
                              onClick={() => onRemoveDependency(index)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              type="button"
                              aria-label={`Remove dependency on ${dependency.dependentCourseCode}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider for Add Course Section */}
          <Separator className="my-6" />
          <div className="pt-0">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={onAddCourse}
                disabled={!canAddCourse}
                className="flex-1"
                size="lg"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Activity
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </>
                )}
              </Button>
              {isEditing && onCancelEdit && (
                <Button
                  onClick={onCancelEdit}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
            </div>
            {!canAddCourse && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Enter an activity name and add at least one time slot
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
