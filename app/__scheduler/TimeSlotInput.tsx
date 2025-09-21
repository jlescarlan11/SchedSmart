"use client";

import React from "react";
import { Clock, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TimeSlotSelector } from "./TimeSlotSelector";
import { TimeSlotDisplay } from "./TimeSlotDisplay";
import type { TimeSlotFormData, TimeSlot } from "@/types/scheduler";

interface TimeSlotInputProps {
  form: UseFormReturn<TimeSlotFormData>;
  selectedDays: string[];
  timeSlots: TimeSlot[];
  onSubmit: (data: TimeSlotFormData) => void;
  onRemoveSlot: (index: number) => void;
  onAddCourse: () => void;
  canAddCourse: boolean;
  dayHandlers: {
    handleDayToggle: (day: string) => void;
    handlePresetSelect: (days: string[]) => void;
    isPresetSelected: (days: string[]) => boolean;
  };
}

export const TimeSlotInput: React.FC<TimeSlotInputProps> = ({
  form,
  selectedDays,
  timeSlots,
  onSubmit,
  onRemoveSlot,
  onAddCourse,
  canAddCourse,
  dayHandlers,
}) => {
  return (
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
              {...dayHandlers}
            />
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </form>
        </Form>

        <TimeSlotDisplay slots={timeSlots} onRemoveSlot={onRemoveSlot} />

        <Button
          onClick={onAddCourse}
          disabled={!canAddCourse}
          className="w-full"
          size="lg"
        >
          Add Course
        </Button>
      </CardContent>
    </Card>
  );
};
