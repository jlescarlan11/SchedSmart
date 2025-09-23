"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trash2, Edit3, Link2, Clock, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ANIMATION_CONFIG } from "@/constants/scheduler";
import { getDayAbbreviation } from "@/utils";
import type { Course, GeneratedSchedule } from "@/types/scheduler";
import { generateScheduleImage } from "./utils/scheduleImage";

interface ActivityListProps {
  courses: Course[];
  onRemoveCourse: (index: number) => void;
  onEditCourse: (index: number) => void;
  onGenerateSchedule: () => void;
  canGenerateSchedule: boolean;
  generatedSchedule?: GeneratedSchedule | null;
}

const CourseItem: React.FC<{
  course: Course;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}> = ({ course, index, onRemove, onEdit }) => {
  // Count dependencies for this activity
  const dependencyCount = course.dependencies?.length || 0;

  // Get unique dependent activities
  const dependentCourses = new Set(
    course.dependencies?.map((dep) => dep.dependentCourseCode) || []
  );

  return (
    <motion.div
      {...ANIMATION_CONFIG.slideInRight}
      transition={{ delay: index * 0.1 }}
      className="p-6 border border-border/30 rounded-lg bg-card/30 hover:bg-accent/30 transition-all duration-300 hover:shadow-sm"
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
          <div className="mt-2 pt-2">
            <Separator className="mb-2" />
            <div className="text-xs text-muted-foreground mb-1">
              Dependencies:
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from(dependentCourses).map((activityCode) => (
                <Badge key={activityCode} variant="secondary" className="text-xs">
                  {activityCode}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ScheduleResults: React.FC<{ generatedSchedule: GeneratedSchedule | null }> = ({ generatedSchedule }) => {
  // Auto-download when schedule is generated
  React.useEffect(() => {
    if (generatedSchedule?.schedule && generatedSchedule.schedule.length > 0) {
      // Small delay to ensure the UI updates before download
      const timer = setTimeout(() => {
        generateScheduleImage(generatedSchedule.schedule);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [generatedSchedule]);

  if (!generatedSchedule) {
    return null;
  }

  const hasConflicts = generatedSchedule.conflicts.length > 0;
  const hasDependencyViolations = (generatedSchedule.dependencyViolations?.length ?? 0) > 0;

  if (!hasConflicts && !hasDependencyViolations) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 space-y-3"
    >
      {hasConflicts && (
        <Alert className="border-amber-200/50 bg-amber-50/30 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-medium mb-2">Scheduling Conflicts:</div>
            <ul className="text-sm space-y-1">
              {generatedSchedule.conflicts.map((conflict, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{conflict}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {hasDependencyViolations && (
        <Alert className="border-red-200/50 bg-red-50/30 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-medium mb-2">Dependency Violations:</div>
            <ul className="text-sm space-y-1">
              {generatedSchedule.dependencyViolations!.map(
                (violation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{violation}</span>
                  </li>
                )
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
};

export const ActivityList: React.FC<ActivityListProps> = ({
  courses,
  onRemoveCourse,
  onEditCourse,
  onGenerateSchedule,
  canGenerateSchedule,
  generatedSchedule,
}) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No activities added yet. Add your first activity to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Added Activities ({courses.length})</CardTitle>
            <Button
              onClick={onGenerateSchedule}
              disabled={!canGenerateSchedule}
              className="flex items-center gap-2 bg-primary/90 hover:bg-primary"
            >
              <Play className="h-4 w-4" />
              Generate Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <AnimatePresence>
            <div className="space-y-4">
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

      {/* Schedule Results */}
      <ScheduleResults generatedSchedule={generatedSchedule || null} />
    </div>
  );
};
