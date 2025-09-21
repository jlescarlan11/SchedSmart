"use client";

import { motion } from "framer-motion";
import React from "react";

import { Course } from "@/types/scheduler";
import { CourseCard } from "./CourseCard";
import { EmptyState } from "./EmptyState";
import { GenerateScheduleButton } from "./GenerateScheduleButton";

// Main Course List Component
interface CourseListProps {
  courses: Course[];
  onRemoveCourse: (index: number) => void;
  onGenerateSchedule: () => void;
  canGenerateSchedule: boolean;
}

export const CourseList = ({
  courses,
  onRemoveCourse,
  onGenerateSchedule,
  canGenerateSchedule,
}: CourseListProps) => {
  if (courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Added Courses</h2>
        <span className="text-sm text-muted-foreground">
          {courses.length} course{courses.length !== 1 ? "s" : ""} added
        </span>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        {courses.map((course, index) => (
          <CourseCard
            key={`${course.courseCode}-${index}`}
            course={course}
            index={index}
            onRemove={onRemoveCourse}
          />
        ))}
      </div>

      {/* Generate Button */}
      <GenerateScheduleButton
        onGenerate={onGenerateSchedule}
        canGenerate={canGenerateSchedule}
      />
    </motion.div>
  );
};
