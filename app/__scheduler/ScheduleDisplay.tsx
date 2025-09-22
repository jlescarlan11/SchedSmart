import React, { useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Camera } from "lucide-react";

interface ScheduleSlot {
  courseCode: string;
  room?: string;
  startTime: string;
  endTime: string;
  days: string[];
}

interface GeneratedSchedule {
  schedule: ScheduleSlot[];
}

// Enhanced color palette matching the image
const COLORS = {
  primary: "#2D5A27", // Dark green like in the image
  primaryLight: "#4A7C59",
  background: "#F0F8E8", // Light green background
  headerBg: "#8BC34A", // Lighter green for header
  border: "#D4EDDA",
  borderStrong: "#C3E6CB",
  borderSubtle: "#E8F5E8", // Very subtle border for downloaded image
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
      slotKey: `${hour}-0`, // hour-0 for first half, hour-1 for second half
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

const ScheduleTable = ({ schedule }: { schedule: ScheduleSlot[] }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const timeSlots = useMemo(() => createTimeSlots(), []);

  // Build the schedule grid with 30-minute slots
  const scheduleGrid = useMemo(() => {
    const grid: Record<
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
        grid[`${day}-${slot.slotKey}`] = null;
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

        // Determine which 30-minute slot to start in
        const startSlotIndex = startMinuteInHour < 30 ? 0 : 1;
        const startSlotKey = `${startHour}-${startSlotIndex}`;

        // Place the starting cell
        const gridKey = `${day}-${startSlotKey}`;
        if (grid.hasOwnProperty(gridKey)) {
          grid[gridKey] = {
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
            if (grid.hasOwnProperty(continueKey)) {
              grid[continueKey] = {
                course,
                isStart: false,
                rowSpan: 0,
              };
            }
          }
        }
      });
    });

    return grid;
  }, [schedule, timeSlots]);

  const downloadAsImage = async () => {
    if (!tableRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = 3;
      const cellWidth = 150;
      const cellHeight = 25; // 25px for each 30-minute slot
      const timeColumnWidth = 80;
      const headerHeight = 40;

      const tableWidth = timeColumnWidth + WEEKDAYS.length * cellWidth;
      const tableHeight = headerHeight + timeSlots.length * cellHeight;

      canvas.width = tableWidth * scale;
      canvas.height = tableHeight * scale;
      ctx.scale(scale, scale);

      // Background
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, tableWidth, tableHeight);

      // Header row
      ctx.fillStyle = COLORS.headerBg;
      ctx.fillRect(0, 0, tableWidth, headerHeight);

      // Header borders
      ctx.strokeStyle = COLORS.borderStrong;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, tableWidth, headerHeight);

      // Header text
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

        // Time column - only draw time label and background for first half of hour
        if (slot.isFirstHalf) {
          // Time column background spans both 30-min slots
          ctx.fillStyle = COLORS.headerBg;
          ctx.fillRect(0, rowY, timeColumnWidth, cellHeight * 2);

          // Time column border spans both slots
          ctx.strokeStyle = COLORS.borderStrong;
          ctx.lineWidth = 1;
          ctx.strokeRect(0, rowY, timeColumnWidth, cellHeight * 2);

          // Time text in the middle of the two slots
          ctx.fillStyle = COLORS.text;
          ctx.font =
            "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(slot.display, timeColumnWidth / 2, rowY + cellHeight);
        }

        // Day cells for this 30-minute slot
        WEEKDAYS.forEach((day, dayIndex) => {
          const cellX = timeColumnWidth + dayIndex * cellWidth;
          const gridData = scheduleGrid[`${day}-${slot.slotKey}`];

          if (gridData?.isStart) {
            // Course starting in this slot
            const blockHeight = gridData.rowSpan * cellHeight;

            // Draw course block
            ctx.fillStyle = COLORS.primary;
            ctx.fillRect(cellX, rowY, cellWidth, blockHeight);

            // Course block border
            ctx.strokeStyle = COLORS.borderStrong;
            ctx.lineWidth = 1;
            ctx.strokeRect(cellX, rowY, cellWidth, blockHeight);

            // Course text
            ctx.fillStyle = COLORS.white;
            ctx.font =
              "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
            ctx.textAlign = "center";

            // Course code
            ctx.fillText(
              gridData.course.courseCode,
              cellX + cellWidth / 2,
              rowY + blockHeight / 2 - 6
            );

            // Room (if available)
            if (gridData.course.room) {
              ctx.font =
                "9px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
              ctx.fillText(
                gridData.course.room,
                cellX + cellWidth / 2,
                rowY + blockHeight / 2 + 6
              );
            }
          } else if (!gridData || !gridData.isStart) {
            // Empty cell or continuation cell (don't draw anything for continuation)
            if (!gridData) {
              ctx.fillStyle = COLORS.background;
              ctx.fillRect(cellX, rowY, cellWidth, cellHeight);
              ctx.strokeStyle = COLORS.borderStrong;
              ctx.lineWidth = 1;
              ctx.strokeRect(cellX, rowY, cellWidth, cellHeight);
            }
          }
        });
      });

      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `schedule-${new Date()
            .toISOString()
            .slice(0, 10)}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    }
  };

  // Group time slots by hour for display
  const groupedTimeSlots = useMemo(() => {
    const groups = [];
    for (let i = 0; i < timeSlots.length; i += 2) {
      groups.push({
        hour: timeSlots[i].hour,
        display: timeSlots[i].display,
        firstHalf: timeSlots[i],
        secondHalf: timeSlots[i + 1],
      });
    }
    return groups;
  }, [timeSlots]);

  return (
    <Card className="shadow-lg border-2" style={{ borderColor: COLORS.border }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between flex-wrap gap-3 text-xl font-semibold">
          <div className="flex items-center gap-3">
            <CalendarDays
              className="h-6 w-6"
              style={{ color: COLORS.primary }}
            />
            <span style={{ color: COLORS.text }}>Class Schedule</span>
          </div>
          <Button
            onClick={downloadAsImage}
            variant="outline"
            size="sm"
            className="transition-colors duration-200"
            style={{
              color: COLORS.primary,
              borderColor: COLORS.primary,
            }}
          >
            <Camera className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={tableRef} className="overflow-auto">
          <table
            className="w-full border-collapse"
            style={{ backgroundColor: COLORS.background }}
          >
            <thead>
              <tr>
                <th
                  className="p-3 text-sm font-bold text-center"
                  style={{
                    backgroundColor: COLORS.headerBg,
                    color: COLORS.text,
                    minWidth: "80px",
                    border: `1px solid ${COLORS.borderStrong}`,
                  }}
                >
                  Time
                </th>
                {WEEKDAYS.map((day) => (
                  <th
                    key={day}
                    className="p-3 text-sm font-bold text-center"
                    style={{
                      backgroundColor: COLORS.headerBg,
                      color: COLORS.text,
                      minWidth: "150px",
                      border: `1px solid ${COLORS.borderStrong}`,
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupedTimeSlots.map((group) => (
                <React.Fragment key={group.hour}>
                  {/* First 30-minute row */}
                  <tr>
                    <td
                      rowSpan={2}
                      className="p-2 text-center text-sm font-semibold"
                      style={{
                        backgroundColor: COLORS.headerBg,
                        color: COLORS.text,
                        border: `1px solid ${COLORS.borderStrong}`,
                        minHeight: "50px",
                      }}
                    >
                      {group.display}
                    </td>
                    {WEEKDAYS.map((day) => {
                      const gridData =
                        scheduleGrid[`${day}-${group.firstHalf.slotKey}`];

                      if (gridData?.isStart) {
                        return (
                          <td
                            key={`${day}-${group.firstHalf.slotKey}`}
                            rowSpan={gridData.rowSpan}
                            className="p-1 text-center relative"
                            style={{
                              backgroundColor: COLORS.primary,
                              color: COLORS.white,
                              border: `1px solid ${COLORS.borderStrong}`,
                              verticalAlign: "middle",
                              minHeight: "25px",
                            }}
                          >
                            <div className="font-bold text-xs">
                              {gridData.course.courseCode}
                            </div>
                            {gridData.course.room && (
                              <div className="text-xs mt-1 opacity-90">
                                {gridData.course.room}
                              </div>
                            )}
                          </td>
                        );
                      }

                      if (gridData && !gridData.isStart) {
                        return null;
                      }

                      return (
                        <td
                          key={`${day}-${group.firstHalf.slotKey}`}
                          className="p-1"
                          style={{
                            backgroundColor: COLORS.background,
                            border: `1px solid ${COLORS.borderStrong}`,
                            height: "25px",
                          }}
                        />
                      );
                    })}
                  </tr>

                  {/* Second 30-minute row */}
                  <tr>
                    {WEEKDAYS.map((day) => {
                      const gridData =
                        scheduleGrid[`${day}-${group.secondHalf.slotKey}`];

                      if (gridData?.isStart) {
                        return (
                          <td
                            key={`${day}-${group.secondHalf.slotKey}`}
                            rowSpan={gridData.rowSpan}
                            className="p-1 text-center relative"
                            style={{
                              backgroundColor: COLORS.primary,
                              color: COLORS.white,
                              border: `1px solid ${COLORS.borderStrong}`,
                              verticalAlign: "middle",
                              minHeight: "25px",
                            }}
                          >
                            <div className="font-bold text-xs">
                              {gridData.course.courseCode}
                            </div>
                            {gridData.course.room && (
                              <div className="text-xs mt-1 opacity-90">
                                {gridData.course.room}
                              </div>
                            )}
                          </td>
                        );
                      }

                      if (gridData && !gridData.isStart) {
                        return null;
                      }

                      return (
                        <td
                          key={`${day}-${group.secondHalf.slotKey}`}
                          className="p-1"
                          style={{
                            backgroundColor: COLORS.background,
                            border: `1px solid ${COLORS.borderStrong}`,
                            height: "25px",
                          }}
                        />
                      );
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export const ScheduleDisplay = ({
  generatedSchedule,
}: {
  generatedSchedule: GeneratedSchedule | null;
}) => {
  // Sample data with 30-minute precision
  const sampleSchedule: GeneratedSchedule = {
    schedule: [
      {
        courseCode: "CMSC 141 A",
        room: "SCI 407",
        startTime: "7:00 AM",
        endTime: "9:00 AM",
        days: ["Monday", "Thursday"],
      },
      {
        courseCode: "CMSC 127 A",
        room: "SCI 406",
        startTime: "9:00 AM",
        endTime: "10:00 AM",
        days: ["Tuesday", "Friday"],
      },
      {
        courseCode: "MATH 141 A",
        room: "AS 233",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        days: ["Monday", "Thursday"],
      },
      {
        courseCode: "MATH 123 A",
        room: "AS 235",
        startTime: "1:00 PM",
        endTime: "2:30 PM",
        days: ["Monday", "Thursday"],
      },
      {
        courseCode: "MATH 189 A",
        room: "AS 235",
        startTime: "1:00 PM",
        endTime: "3:00 PM",
        days: ["Tuesday", "Friday"],
      },
      {
        courseCode: "PHILARTS 1 H",
        room: "UG 218",
        startTime: "3:00 PM",
        endTime: "5:00 PM",
        days: ["Monday", "Thursday"],
      },
      {
        courseCode: "CMSC 127 A2",
        room: "SCI 403",
        startTime: "4:30 PM",
        endTime: "6:00 PM",
        days: ["Friday"],
      },
      {
        courseCode: "ENG 102",
        room: "HUM 201",
        startTime: "2:30 PM",
        endTime: "4:00 PM",
        days: ["Wednesday"],
      },
    ],
  };

  const displaySchedule = generatedSchedule || sampleSchedule;

  if (!displaySchedule) {
    return (
      <div className="text-center py-16" style={{ color: COLORS.textLight }}>
        <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-40" />
        <p className="font-light">No schedule available</p>
      </div>
    );
  }

  return <ScheduleTable schedule={displaySchedule.schedule} />;
};

export default ScheduleDisplay;
