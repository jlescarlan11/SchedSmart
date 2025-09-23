"use client";

import React from "react";
import { Clock, Plus, Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TimeSlotSelector } from "./TimeSlotSelector";
import { TimeSlotDisplay } from "./TimeSlotDisplay";
import { DependencyInput } from "./DependencyInput";
import type {
  TimeSlotFormData,
  TimeSlot,
  Course,
  DependencyFormData,
} from "@/types/scheduler";

interface DayHandlers {
  handleDayToggle: (day: string) => void;
  handlePresetSelect: (days: string[]) => void;
  isPresetSelected: (days: string[]) => boolean;
}

interface CourseHandlers {
  onDependencySubmit: (data: DependencyFormData) => void;
  removeDependency: (index: number) => void;
  selectSlotForDependencies: (index: number) => void;
}

interface TimeSlotInputProps {
  form: UseFormReturn<TimeSlotFormData>;
  dependencyForm: UseFormReturn<DependencyFormData>;
  selectedDays: string[];
  timeSlots: TimeSlot[];
  currentCourse: Course;
  courses: Course[];
  currentSlotIndex: number | null;
  editingCourseIndex: number | null;
  onSubmit: (data: TimeSlotFormData) => void;
  onRemoveSlot: (index: number) => void;
  onAddCourse: () => void;
  onCancelEdit?: () => void;
  canAddCourse: boolean;
  dayHandlers: DayHandlers;
  courseHandlers: CourseHandlers;
}

export const TimeSlotInput: React.FC<TimeSlotInputProps> = ({
  form,
  dependencyForm,
  selectedDays,
  timeSlots,
  currentCourse,
  courses,
  currentSlotIndex,
  editingCourseIndex,
  onSubmit,
  onRemoveSlot,
  onAddCourse,
  onCancelEdit,
  canAddCourse,
  dayHandlers,
  courseHandlers,
}) => {
  const isEditing = editingCourseIndex !== null;

  return (
    <div className="space-y-4">
      {/* Time Slots Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TimeSlotSelector
                form={form}
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

          <TimeSlotDisplay
            slots={timeSlots}
            onRemoveSlot={onRemoveSlot}
            onSelectSlot={courseHandlers.selectSlotForDependencies}
            selectedSlotIndex={currentSlotIndex}
          />
        </CardContent>
      </Card>

      {/* Dependencies Card */}
      <DependencyInput
        form={dependencyForm}
        currentCourse={currentCourse}
        courses={courses}
        onSubmit={courseHandlers.onDependencySubmit}
        onRemoveDependency={courseHandlers.removeDependency}
        currentSlotIndex={currentSlotIndex}
      />

      {/* Add/Update Course Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              onClick={onAddCourse}
              disabled={!canAddCourse}
              className="flex-1"
              size="lg"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Course
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </>
              )}
            </Button>
            {isEditing && onCancelEdit && (
              <Button onClick={onCancelEdit} variant="outline" size="lg">
                Cancel
              </Button>
            )}
          </div>
          {!canAddCourse && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Enter a course code and add at least one time slot
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
