import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import React from "react";
import type { GeneratedSchedule } from "@/types/scheduler";
import { generateScheduleImage } from "./utils/scheduleImage";

export const ScheduleDisplay = ({ generatedSchedule }: { generatedSchedule: GeneratedSchedule | null }) => {
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

  return (
    <div className="mt-6 space-y-3">
      {hasConflicts && (
        <Alert className="border-amber-200 bg-amber-50">
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
        <Alert className="border-red-200 bg-red-50">
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
    </div>
  );
};

export default ScheduleDisplay;
