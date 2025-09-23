"use client";

import { motion } from "motion/react";
import React from "react";

import { Col2, Col3, Grid } from "@/components/layout/grid";
import { useScheduler } from "@/hooks/useScheduler";
import { ActivityInput } from "./ActivityInput";
import { ActivityList } from "./ActivityList";

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
    <div id="scheduler" className="wrapper section-spacing min-h-screen py-12">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h2 className="zen-text-accent mb-4">Smart Scheduler</h2>
        <p className="zen-text-secondary max-w-2xl mx-auto">
          Add your activities, set time slots, and let our intelligent algorithm
          create your perfect schedule
        </p>
      </motion.div>

      {/* 2-Column Grid Layout */}
      <Grid>
        {/* Left Column - Activity Input */}
        <Col2>
          {/* Unified Activity Input with Dependencies */}
          <ActivityInput
            courseForm={courseForm}
            timeSlotForm={timeSlotForm}
            dependencyForm={dependencyForm}
            selectedDays={selectedDays}
            timeSlots={currentCourse.availableSlots}
            currentCourse={currentCourse}
            courses={courses}
            editingCourseIndex={editingCourseIndex}
            currentSlotIndex={currentSlotIndex}
            canAddCourse={canAddCourse}
            hasData={hasData}
            onCourseSubmit={courseHandlers.onCourseSubmit}
            onTimeSlotSubmit={courseHandlers.onTimeSlotSubmit}
            onDependencySubmit={courseHandlers.onDependencySubmit}
            onCodeChange={courseHandlers.updateCurrentCourseCode}
            onRemoveSlot={courseHandlers.removeTimeSlot}
            onRemoveDependency={courseHandlers.removeDependency}
            onAddCourse={courseHandlers.addCourse}
            onCancelEdit={courseHandlers.cancelEdit}
            onReset={resetScheduler}
            dayHandlers={dayHandlers}
            courseHandlers={{
              selectSlotForDependencies:
                courseHandlers.selectSlotForDependencies,
            }}
          />
        </Col2>

        {/* Right Column - Activity List */}
        <Col3>
          <ActivityList
            courses={courses}
            onRemoveCourse={courseHandlers.removeCourse}
            onEditCourse={courseHandlers.editCourse}
            onGenerateSchedule={handleGenerateSchedule}
            canGenerateSchedule={canGenerateSchedule}
            generatedSchedule={generatedSchedule}
          />
        </Col3>
      </Grid>
    </div>
  );
};

export default SchedulerSection;
