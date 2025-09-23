"use client";

import React from "react";
import { Calendar, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useScheduler } from "@/hooks/useScheduler";
import { CourseInput } from "./CourseInput";
import { DependencyInput } from "./DependencyInput";
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
          {/* Unified Course Input */}
          <CourseInput
            courseForm={courseForm}
            timeSlotForm={timeSlotForm}
            selectedDays={selectedDays}
            timeSlots={currentCourse.availableSlots}
            currentCourse={currentCourse}
            editingCourseIndex={editingCourseIndex}
            currentSlotIndex={currentSlotIndex}
            canAddCourse={canAddCourse}
            hasData={hasData}
            onCourseSubmit={courseHandlers.onCourseSubmit}
            onTimeSlotSubmit={courseHandlers.onTimeSlotSubmit}
            onCodeChange={courseHandlers.updateCurrentCourseCode}
            onRemoveSlot={courseHandlers.removeTimeSlot}
            onAddCourse={courseHandlers.addCourse}
            onCancelEdit={courseHandlers.cancelEdit}
            onReset={resetScheduler}
            dayHandlers={dayHandlers}
            courseHandlers={{
              selectSlotForDependencies: courseHandlers.selectSlotForDependencies,
            }}
          />

          {/* Dependencies Input */}
          <DependencyInput
            form={dependencyForm}
            currentCourse={currentCourse}
            courses={courses}
            onSubmit={courseHandlers.onDependencySubmit}
            onRemoveDependency={courseHandlers.removeDependency}
            currentSlotIndex={currentSlotIndex}
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
