"use client";

import React from "react";
import { BookOpen, Clock, Plus, Save, RefreshCw, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { TimeSlotSelector } from "./TimeSlotSelector";
import { TimeSlotList } from "./time-slots/TimeSlotList";
import type {
  CourseFormData,
  TimeSlotFormData,
  TimeSlot,
  Course,
} from "@/types/scheduler";

interface DayHandlers {
  handleDayToggle: (day: string) => void;
  handlePresetSelect: (days: string[]) => void;
  isPresetSelected: (days: string[]) => boolean;
}

interface CourseHandlers {
  selectSlotForDependencies: (index: number) => void;
}

interface CourseInputProps {
  // Forms
  courseForm: UseFormReturn<CourseFormData>;
  timeSlotForm: UseFormReturn<TimeSlotFormData>;
  
  // State
  selectedDays: string[];
  timeSlots: TimeSlot[];
  currentCourse: Course;
  editingCourseIndex?: number | null;
  currentSlotIndex: number | null;
  canAddCourse: boolean;
  hasData: boolean;
  
  // Handlers
  onCourseSubmit: (data: CourseFormData) => void;
  onTimeSlotSubmit: (data: TimeSlotFormData) => void;
  onCodeChange: (code: string) => void;
  onRemoveSlot: (index: number) => void;
  onAddCourse: () => void;
  onCancelEdit?: () => void;
  onReset: () => void;
  dayHandlers: DayHandlers;
  courseHandlers: CourseHandlers;
}

export const CourseInput: React.FC<CourseInputProps> = ({
  courseForm,
  timeSlotForm,
  selectedDays,
  timeSlots,
  currentCourse,
  editingCourseIndex,
  currentSlotIndex,
  canAddCourse,
  hasData,
  onCourseSubmit,
  onTimeSlotSubmit,
  onCodeChange,
  onRemoveSlot,
  onAddCourse,
  onCancelEdit,
  onReset,
  dayHandlers,
  courseHandlers,
}) => {
  const isEditing = editingCourseIndex !== null;

  return (
    <div className="space-y-4">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Course Setup</h2>
        </div>
        {hasData && (
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Combined Course Input Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
            {isEditing && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Editing Mode</Badge>
                {onCancelEdit && (
                  <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Code Section */}
          <Form {...courseForm}>
            <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-4">
              <FormField
                control={courseForm.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., CS-101, MATH-201"
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
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h3 className="font-medium">Time Slots</h3>
            </div>

            {/* Time Slot Section */}
            <Form {...timeSlotForm}>
              <form onSubmit={timeSlotForm.handleSubmit(onTimeSlotSubmit)} className="space-y-4">
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
        </CardContent>
      </Card>

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
