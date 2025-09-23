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
    currentSlotIndex,
    editingCourseIndex,
    selectedDays,
    generatedSchedule,

    // Forms
    courseForm,
    timeSlotForm,
    dependencyForm,

    // Handlers
    dayHandlers,
    courseHandlers,
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
            onSubmit={courseHandlers.onCourseSubmit}
            onCodeChange={courseHandlers.updateCurrentCourseCode}
            editingCourseIndex={editingCourseIndex}
            onCancelEdit={courseHandlers.cancelEdit}
          />

          {/* Time Slot Input with Dependencies */}
          <TimeSlotInput
            form={timeSlotForm}
            dependencyForm={dependencyForm}
            selectedDays={selectedDays}
            timeSlots={currentCourse.availableSlots}
            currentCourse={currentCourse}
            courses={courses}
            currentSlotIndex={currentSlotIndex}
            editingCourseIndex={editingCourseIndex}
            onSubmit={courseHandlers.onTimeSlotSubmit}
            onRemoveSlot={courseHandlers.removeTimeSlot}
            onAddCourse={courseHandlers.addCourse}
            onCancelEdit={courseHandlers.cancelEdit}
            canAddCourse={canAddCourse}
            dayHandlers={dayHandlers}
            courseHandlers={{
              onDependencySubmit: courseHandlers.onDependencySubmit,
              removeDependency: courseHandlers.removeDependency,
              selectSlotForDependencies:
                courseHandlers.selectSlotForDependencies,
            }}
          />
        </div>

        <div className="lg:col-span-3">
          {/* Course List and Schedule Generation */}
          <CourseList
            courses={courses}
            onRemoveCourse={courseHandlers.removeCourse}
            onEditCourse={courseHandlers.editCourse}
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
