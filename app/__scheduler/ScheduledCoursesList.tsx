"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleSlot {
  courseCode: string;
  startTime: string;
  endTime: string;
  days: string[];
}

interface ScheduledCoursesListProps {
  courses: ScheduleSlot[];
}

export const ScheduledCoursesList: React.FC<ScheduledCoursesListProps> = ({
  courses,
}) => {
  if (courses.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Scheduled Courses ({courses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {courses.map((slot, index) => (
            <motion.div
              key={`${slot.courseCode}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-green-800 dark:text-green-200">
                  {slot.courseCode}
                </div>
                <div className="flex items-center gap-1 text-sm text-green-700 dark:text-green-300">
                  <Clock className="h-3 w-3" />
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {slot.days.map((day) => (
                  <Badge
                    key={day}
                    variant="outline"
                    className="text-xs border-green-300 text-green-700 dark:border-green-700 dark:text-green-300"
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
