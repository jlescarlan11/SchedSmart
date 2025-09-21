"use client";

import React from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GeneratedSchedule } from "@/types/scheduler";

interface ScheduleHeaderProps {
  generatedSchedule: GeneratedSchedule;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  generatedSchedule,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Generated Schedule
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {generatedSchedule.scheduledCourses} of{" "}
            {generatedSchedule.totalCourses} courses scheduled
          </span>
          <span>•</span>
          <span>
            Generated:{" "}
            {new Date(generatedSchedule.generatedAt).toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {generatedSchedule.scheduledCourses > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully scheduled {generatedSchedule.scheduledCourses}{" "}
              courses.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
