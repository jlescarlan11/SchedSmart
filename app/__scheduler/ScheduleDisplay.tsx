import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import React from "react";

interface ScheduleSlot {
  courseCode: string;
  room?: string;
  startTime: string;
  endTime: string;
  days: string[];
}

interface GeneratedSchedule {
  schedule: ScheduleSlot[];
  conflicts: string[];
  totalCourses: number;
  scheduledCourses: number;
  algorithm: string;
  generatedAt: string;
  dependencyViolations?: string[];
}

// Enhanced color palette for image generation
const COLORS = {
  primary: "#2D5A27", // Dark green
  primaryLight: "#4A7C59",
  background: "#F0F8E8", // Light green background
  headerBg: "#8BC34A", // Lighter green for header
  border: "#D4EDDA",
  borderStrong: "#C3E6CB",
  text: "#1B4332",
  textLight: "#6C757D",
  white: "#FFFFFF",
};

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Convert time string to minutes from midnight
const parseTime = (time: string): number => {
  const [timePart, period] = time.trim().split(" ");
  const [hours, minutes = "0"] = timePart.split(":");
  let hour = parseInt(hours);
  const minute = parseInt(minutes);

  if (period?.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (period?.toUpperCase() === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
};

// Format hour for display (convert 24-hour to 12-hour format)
const formatHourForDisplay = (hour: number): string => {
  if (hour === 0) return "12";
  if (hour <= 12) return hour.toString();
  return (hour - 12).toString();
};

// Create 30-minute time slots from 7 AM to 7 PM
const createTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 18; hour++) {
    const currentHour = formatHourForDisplay(hour);
    const nextHour = formatHourForDisplay(hour + 1);
    const displayTime = `${currentHour}-${nextHour}`;

    // First half of the hour
    slots.push({
      hour: hour,
      isFirstHalf: true,
      display: displayTime,
      startMinutes: hour * 60,
      endMinutes: hour * 60 + 30,
      slotKey: `${hour}-0`,
    });

    // Second half of the hour
    slots.push({
      hour: hour,
      isFirstHalf: false,
      display: displayTime,
      startMinutes: hour * 60 + 30,
      endMinutes: (hour + 1) * 60,
      slotKey: `${hour}-1`,
    });
  }
  return slots;
};

// Generate and auto-download schedule image
const generateScheduleImage = async (
  schedule: ScheduleSlot[]
): Promise<void> => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const timeSlots = createTimeSlots();
    const scale = 3;
    const cellWidth = 150;
    const cellHeight = 25;
    const timeColumnWidth = 80;
    const headerHeight = 40;

    const tableWidth = timeColumnWidth + WEEKDAYS.length * cellWidth;
    const tableHeight = headerHeight + timeSlots.length * cellHeight;

    canvas.width = tableWidth * scale;
    canvas.height = tableHeight * scale;
    ctx.scale(scale, scale);

    // Build the schedule grid
    const scheduleGrid: Record<
      string,
      {
        course: ScheduleSlot;
        isStart: boolean;
        rowSpan: number;
      } | null
    > = {};

    // Initialize empty grid
    timeSlots.forEach((slot) => {
      WEEKDAYS.forEach((day) => {
        scheduleGrid[`${day}-${slot.slotKey}`] = null;
      });
    });

    // Place courses in the grid
    schedule.forEach((course) => {
      const startMinutes = parseTime(course.startTime);
      const endMinutes = parseTime(course.endTime);
      const durationMinutes = endMinutes - startMinutes;
      const duration30MinSlots = durationMinutes / 30;

      course.days.forEach((day) => {
        const startHour = Math.floor(startMinutes / 60);
        const startMinuteInHour = startMinutes % 60;
        const startSlotIndex = startMinuteInHour < 30 ? 0 : 1;
        const startSlotKey = `${startHour}-${startSlotIndex}`;

        const gridKey = `${day}-${startSlotKey}`;
        if (scheduleGrid.hasOwnProperty(gridKey)) {
          scheduleGrid[gridKey] = {
            course,
            isStart: true,
            rowSpan: duration30MinSlots,
          };

          // Mark continuation cells
          let currentHour = startHour;
          let currentSlotIndex = startSlotIndex;

          for (let i = 1; i < duration30MinSlots; i++) {
            currentSlotIndex++;
            if (currentSlotIndex >= 2) {
              currentSlotIndex = 0;
              currentHour++;
            }

            const continueKey = `${day}-${currentHour}-${currentSlotIndex}`;
            if (scheduleGrid.hasOwnProperty(continueKey)) {
              scheduleGrid[continueKey] = {
                course,
                isStart: false,
                rowSpan: 0,
              };
            }
          }
        }
      });
    });

    // Draw background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, tableWidth, tableHeight);

    // Draw header row
    ctx.fillStyle = COLORS.headerBg;
    ctx.fillRect(0, 0, tableWidth, headerHeight);

    // Header borders and text
    ctx.strokeStyle = COLORS.borderStrong;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, tableWidth, headerHeight);

    ctx.fillStyle = COLORS.text;
    ctx.font =
      "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Time header
    ctx.strokeRect(0, 0, timeColumnWidth, headerHeight);
    ctx.fillText("Time", timeColumnWidth / 2, headerHeight / 2);

    // Day headers
    WEEKDAYS.forEach((day, index) => {
      const x = timeColumnWidth + index * cellWidth;
      ctx.strokeRect(x, 0, cellWidth, headerHeight);
      ctx.fillText(day, x + cellWidth / 2, headerHeight / 2);
    });

    // Draw each 30-minute time slot
    timeSlots.forEach((slot, slotIndex) => {
      const rowY = headerHeight + slotIndex * cellHeight;

      // Time column - only draw for first half of hour
      if (slot.isFirstHalf) {
        ctx.fillStyle = COLORS.headerBg;
        ctx.fillRect(0, rowY, timeColumnWidth, cellHeight * 2);

        ctx.strokeStyle = COLORS.borderStrong;
        ctx.lineWidth = 1;
        ctx.strokeRect(0, rowY, timeColumnWidth, cellHeight * 2);

        ctx.fillStyle = COLORS.text;
        ctx.font =
          "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(slot.display, timeColumnWidth / 2, rowY + cellHeight);
      }

      // Day cells
      WEEKDAYS.forEach((day, dayIndex) => {
        const cellX = timeColumnWidth + dayIndex * cellWidth;
        const gridData = scheduleGrid[`${day}-${slot.slotKey}`];

        if (gridData?.isStart) {
          const blockHeight = gridData.rowSpan * cellHeight;

          // Course block
          ctx.fillStyle = COLORS.primary;
          ctx.fillRect(cellX, rowY, cellWidth, blockHeight);

          ctx.strokeStyle = COLORS.borderStrong;
          ctx.lineWidth = 1;
          ctx.strokeRect(cellX, rowY, cellWidth, blockHeight);

          // Course text
          ctx.fillStyle = COLORS.white;
          ctx.font =
            "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
          ctx.textAlign = "center";

          ctx.fillText(
            gridData.course.courseCode,
            cellX + cellWidth / 2,
            rowY + blockHeight / 2 - 6
          );

          if (gridData.course.room) {
            ctx.font =
              "9px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
            ctx.fillText(
              gridData.course.room,
              cellX + cellWidth / 2,
              rowY + blockHeight / 2 + 6
            );
          }
        } else if (!gridData) {
          // Empty cell
          ctx.fillStyle = COLORS.background;
          ctx.fillRect(cellX, rowY, cellWidth, cellHeight);
          ctx.strokeStyle = COLORS.borderStrong;
          ctx.lineWidth = 1;
          ctx.strokeRect(cellX, rowY, cellWidth, cellHeight);
        }
      });
    });

    // Auto-download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `schedule-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  } catch (error) {
    console.error("Error generating schedule image:", error);
  }
};

export const ScheduleDisplay = ({
  generatedSchedule,
  isGenerating,
}: {
  generatedSchedule: GeneratedSchedule | null;
  isGenerating?: boolean;
}) => {
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

  // Show loader when generating
  if (isGenerating) {
    return (
      <div className="mt-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-blue-700 font-medium">
                Generating schedule...
              </p>
              <p className="text-blue-600 text-sm">
                Please wait while we create your optimal schedule
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!generatedSchedule) {
    return null;
  }

  const hasConflicts = generatedSchedule.conflicts.length > 0;
  const hasDependencyViolations =
    (generatedSchedule.dependencyViolations?.length ?? 0) > 0;

  <div className="space-y-3">
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
            {generatedSchedule.dependencyViolations!.map((violation, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{violation}</span>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    )}
  </div>;
};

export default ScheduleDisplay;
