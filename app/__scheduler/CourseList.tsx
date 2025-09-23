"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trash2, Edit3, Link2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ANIMATION_CONFIG } from "@/constants/scheduler";
import { getDayAbbreviation } from "@/utils/dateHelpers";
import type { Course } from "@/types/scheduler";

interface CourseListProps {
  courses: Course[];
  onRemoveCourse: (index: number) => void;
  onEditCourse: (index: number) => void;
  onGenerateSchedule: () => void;
  canGenerateSchedule: boolean;
}

const CourseItem: React.FC<{
  course: Course;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}> = ({ course, index, onRemove, onEdit }) => {
  // Count dependencies for this course
  const dependencyCount = course.dependencies?.length || 0;

  // Get unique dependent courses
  const dependentCourses = new Set(
    course.dependencies?.map((dep) => dep.dependentCourseCode) || []
  );

  return (
    <motion.div
      {...ANIMATION_CONFIG.slideInRight}
      transition={{ delay: index * 0.1 }}
      className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-lg">{course.courseCode}</h4>
          {dependencyCount > 0 && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              <Link2 className="h-3 w-3" />
              {dependencyCount} deps
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(index)}
            className="text-primary hover:text-primary"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{course.availableSlots.length} time slot(s)</span>
        </div>

        {/* Show time slots */}
        <div className="space-y-1">
          {course.availableSlots.map((slot, slotIndex) => (
            <div key={slotIndex} className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">
                Slot {slotIndex + 1}:
              </span>
              <div className="flex gap-1">
                {slot.days.map((day) => (
                  <Badge
                    key={day}
                    variant="outline"
                    className="text-xs px-1 py-0"
                  >
                    {getDayAbbreviation(day)}
                  </Badge>
                ))}
              </div>
              <span className="text-muted-foreground">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
          ))}
        </div>

        {/* Show dependencies if any */}
        {dependentCourses.size > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-1">
              Dependencies:
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from(dependentCourses).map((courseCode) => (
                <Badge key={courseCode} variant="secondary" className="text-xs">
                  {courseCode}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  onRemoveCourse,
  onEditCourse,
  onGenerateSchedule,
  canGenerateSchedule,
}) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No courses added yet. Add your first course to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Added Courses ({courses.length})</CardTitle>
          <Button
            onClick={onGenerateSchedule}
            disabled={!canGenerateSchedule}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Generate Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-3">
            {courses.map((course, index) => (
              <CourseItem
                key={course.courseCode}
                course={course}
                index={index}
                onRemove={onRemoveCourse}
                onEdit={onEditCourse}
              />
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
