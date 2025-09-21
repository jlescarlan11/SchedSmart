"use client";

import React from "react";
import { Calendar, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useScheduler } from "@/hooks/useScheduler";
import { CourseCodeInput } from "./CourseCodeInput";
import { TimeSlotInput } from "./TimeSlotInput";
import { CourseList } from "./CourseList";
import { ScheduleDisplay } from "./ScheduleDisplay";

const SchedulerSection: React.FC = () => {
  const {
    // State
    courses,
    currentCourse,
    selectedDays,
    generatedSchedule,

    // Forms
    courseForm,
    timeSlotForm,

    // Handlers
    dayHandlers,
    courseHandlers: {
      onCourseSubmit,
      onTimeSlotSubmit,
      addCourse,
      removeTimeSlot,
      updateCurrentCourseCode,
      removeCourse,
    },
    scheduleHandlers: { handleGenerateSchedule, resetScheduler },

    // Computed values
    canAddCourse,
    canGenerateSchedule,
    hasData,
  } = useScheduler();

  return (
    <div className="section-spacing min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Course Scheduler</h1>
            </div>

            {hasData && (
              <Button
                onClick={resetScheduler}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Course Code Input */}
          <CourseCodeInput
            form={courseForm}
            onSubmit={onCourseSubmit}
            onCodeChange={updateCurrentCourseCode}
          />

          {/* Time Slot Input */}
          <TimeSlotInput
            form={timeSlotForm}
            selectedDays={selectedDays}
            timeSlots={currentCourse.availableSlots}
            onSubmit={onTimeSlotSubmit}
            onRemoveSlot={removeTimeSlot}
            onAddCourse={addCourse}
            canAddCourse={canAddCourse}
            dayHandlers={dayHandlers}
          />
        </div>

        <div className="lg:col-span-3">
          {/* Course List and Schedule Generation */}
          <CourseList
            courses={courses}
            onRemoveCourse={removeCourse}
            onGenerateSchedule={handleGenerateSchedule}
            canGenerateSchedule={canGenerateSchedule}
          />

          {/* Generated Schedule Display */}
          <ScheduleDisplay generatedSchedule={generatedSchedule} />
        </div>
      </div>
    </div>
  );
};

export default SchedulerSection;
