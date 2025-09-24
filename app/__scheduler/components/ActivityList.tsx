"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Trash2, Edit3, Link2, Clock, AlertTriangle, MoreVertical, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ANIMATION_CONFIG } from "@/constants/scheduler";
import { getDayAbbreviation } from "@/utils";
import { generateScheduleImage } from "../utils/scheduleImage";

import { useSchedulerContext } from "@/contexts/SchedulerContext";

export const ActivityList: React.FC = () => {
  const {
    activities,
    generatedSchedule,
    isNewlyGenerated,
    canGenerateSchedule,
    activityHandlers,
    scheduleHandlers,
  } = useSchedulerContext();

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      scheduleHandlers.handleGenerateSchedule();
      toast.success("Schedule generated successfully!");
    } catch {
      toast.error("Failed to generate schedule");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSchedule = async () => {
    if (!generatedSchedule) return;
    
    setIsLoading(true);
    try {
      await generateScheduleImage(generatedSchedule.schedule);
      toast.success("Schedule downloaded!");
    } catch {
      toast.error("Failed to download schedule");
    } finally {
      setIsLoading(false);
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Activities Yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first activity to get started with scheduling.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between flex-wrap gap-4">
            <span className="flex-shrink-0">Activities ({activities.length})</span>
            <Button
              onClick={handleGenerateSchedule}
              disabled={!canGenerateSchedule || isGenerating}
              className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto"
            >
              <Play className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Schedule"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <ActivityItem
                key={`${activity.activityCode}-${index}`}
                activity={activity}
                index={index}
                onRemove={activityHandlers.removeActivity}
                onEdit={activityHandlers.editActivity}
              />
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Generated Schedule Display */}
      {generatedSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between flex-wrap gap-4">
              <span>Generated Schedule</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadSchedule}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isLoading ? "Downloading..." : "Download"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={scheduleHandlers.resetScheduler}
                >
                  Reset
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleDisplay schedule={generatedSchedule} isNewlyGenerated={isNewlyGenerated} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ActivityItem: React.FC<{
  activity: import("@/types/scheduler").Activity;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}> = ({ activity, index, onRemove, onEdit }) => {
  const dependencyCount = activity.dependencies?.length || 0;

  return (
    <motion.div
      {...ANIMATION_CONFIG.slideInRight}
      transition={{ delay: index * 0.1 }}
      className="p-2 border border-border/30 rounded-lg bg-card/30 hover:bg-accent/30 transition-all duration-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-lg">{activity.activityCode}</h4>
          {dependencyCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="flex items-center gap-1  text-xs cursor-help">
                  <Link2 className="h-3 w-3" />
                  {dependencyCount} dependenc{dependencyCount > 1 ? 'ies' : 'y'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-background">This activity has {dependencyCount} dependency relationship{dependencyCount > 1 ? 's' : ''}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(index)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{activity.activityCode}&quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onRemove(index)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Time Slots */}
      <div className="space-y-2">
        {activity.availableSlots.map((slot: import("@/types/scheduler").TimeSlot, slotIndex: number) => {
          // Get dependencies for this specific slot
          const slotDependencies = activity.dependencies?.filter(
            (dep) => dep.activityCode === activity.activityCode && dep.slotIndex === slotIndex
          ) || [];

          return (
            <div key={slotIndex} className="space-y-1">
              {/* Time Slot */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span>
                  {slot.days.map(getDayAbbreviation).join(", ")} • {slot.startTime} - {slot.endTime}
                </span>
              </div>
              
              {/* Dependencies for this slot */}
              {slotDependencies.length > 0 && (
                <div className="ml-6 space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                 
                    <span>Depends on:</span>
                  </div>
                  {slotDependencies.map((dep, depIndex) => (
                    <div key={depIndex} className="ml-4 flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                      <span>{dep.dependentActivityCode} (Slot {dep.dependentSlotIndex + 1})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const ScheduleDisplay: React.FC<{
  schedule: import("@/types/scheduler").GeneratedSchedule;
  isNewlyGenerated: boolean;
}> = ({ schedule }) => {
  const progress = (schedule.scheduledActivities / schedule.totalActivities) * 100;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Scheduled Activities</span>
          <span>{schedule.scheduledActivities}/{schedule.totalActivities}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Conflicts */}
      {schedule.conflicts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Conflicts detected:</strong>
            <ul className="mt-2 list-disc list-inside">
              {schedule.conflicts.map((conflict: string, index: number) => (
                <li key={index} className="text-sm">{conflict}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Schedule Items */}
      <div className="space-y-2">
        {schedule.schedule.map((item: import("@/types/scheduler").ScheduleSlot, index: number) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-accent/30 rounded gap-2">
            <span className="font-medium flex-shrink-0">{item.activityCode}</span>
            <span className="text-sm text-muted-foreground sm:text-right whitespace-nowrap">
              {item.days.map(getDayAbbreviation).join(", ")} • {item.startTime} - {item.endTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
