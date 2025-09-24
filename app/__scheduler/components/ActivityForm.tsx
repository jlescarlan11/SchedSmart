"use client";

import React from "react";
import { motion } from "motion/react";
import { BookOpen, Plus, X } from "lucide-react";

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

import { useSchedulerContext } from "@/contexts/SchedulerContext";
import { TimeSlotSelector } from "../TimeSlotSelector";
import { TimeSlotList } from "../time-slots/TimeSlotList";
import { DependencyForm } from "./DependencyForm";

export const ActivityForm: React.FC = () => {
  const {
    currentActivity,
    currentSlotIndex,
    selectedDays,
    editingActivityIndex,
    canAddActivity,
    activityForm,
    timeSlotForm,
    dayHandlers,
    activityHandlers,
  } = useSchedulerContext();

  const isEditing = editingActivityIndex !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Activity Code Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {isEditing ? "Edit Activity" : "Add New Activity"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...activityForm}>
            <form onSubmit={activityForm.handleSubmit(activityHandlers.onActivitySubmit)} className="space-y-4">
              <FormField
                control={activityForm.control}
                name="activityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., MATH101, Study Group"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          activityHandlers.updateCurrentActivityCode(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Time Slots Section */}
      {currentActivity.activityCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Time Slots</span>
              <Badge variant="secondary">{currentActivity.availableSlots.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...timeSlotForm}>
              <form onSubmit={timeSlotForm.handleSubmit(activityHandlers.onTimeSlotSubmit)} className="space-y-4">
                <TimeSlotSelector
                  form={timeSlotForm}
                  selectedDays={selectedDays}
                  handleDayToggle={dayHandlers.handleDayToggle}
                  handlePresetSelect={dayHandlers.handlePresetSelect}
                  isPresetSelected={dayHandlers.isPresetSelected}
                />
                <Button type="submit" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </form>
            </Form>
            
            <TimeSlotList
              slots={currentActivity.availableSlots}
              onRemoveSlot={activityHandlers.removeTimeSlot}
              onSelectSlot={activityHandlers.selectSlotForDependencies}
              selectedSlotIndex={currentSlotIndex}
            />
          </CardContent>
        </Card>
      )}

      {/* Dependencies Section */}
      {currentActivity.availableSlots.length > 0 && (
        <DependencyForm />
      )}

      {/* Action Buttons */}
      {currentActivity.activityCode && (
        <div className="space-y-2">
          {!canAddActivity && currentActivity.availableSlots.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Add at least one time slot to complete the activity
            </p>
          )}
          <div className="flex gap-2">
            <Button
              onClick={activityHandlers.addActivity}
              disabled={!canAddActivity}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isEditing ? "Update Activity" : "Add Activity"}
            </Button>
            
            {isEditing && (
              <Button
                variant="outline"
                onClick={activityHandlers.cancelEdit}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
