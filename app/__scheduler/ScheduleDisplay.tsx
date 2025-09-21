import React, { useMemo, useRef } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileDown, AlertCircle, Download } from "lucide-react";

// ============= TYPES =============
interface ScheduleSlot {
  courseCode: string;
  startTime: string;
  endTime: string;
  days: string[];
  slotIndex?: number;
}

interface GeneratedSchedule {
  schedule: ScheduleSlot[];
  conflicts: string[];
  totalCourses: number;
  scheduledCourses: number;
  algorithm: string;
  generatedAt: string;
}

// ============= UTILITIES =============
const courseColors = [
  "#2D5D31",
  "#1E3A5F",
  "#8B4513",
  "#4B0082",
  "#006400",
  "#191970",
  "#8B0000",
  "#556B2F",
];

const parseTime12to24 = (time12h: string): { hour: number; minute: number } => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (hours === 12) hours = 0;
  if (modifier === "PM") hours += 12;

  return { hour: hours, minute: minutes || 0 };
};

const createCourseColorMap = (schedule: ScheduleSlot[]) => {
  const map: { [key: string]: string } = {};
  let colorIndex = 0;
  schedule.forEach((slot) => {
    if (!map[slot.courseCode]) {
      map[slot.courseCode] = courseColors[colorIndex % courseColors.length];
      colorIndex++;
    }
  });
  return map;
};

const createScheduleEvents = (
  schedule: ScheduleSlot[],
  courseColorMap: { [key: string]: string }
) => {
  return schedule.flatMap((slot) => {
    return slot.days.map((day) => {
      const startTimeParsed = parseTime12to24(slot.startTime);
      const endTimeParsed = parseTime12to24(slot.endTime);

      return {
        courseCode: slot.courseCode,
        day,
        startHour: startTimeParsed.hour,
        startMinute: startTimeParsed.minute,
        endHour: endTimeParsed.hour,
        endMinute: endTimeParsed.minute,
        startTime: slot.startTime,
        endTime: slot.endTime,
        color: courseColorMap[slot.courseCode],
        duration:
          endTimeParsed.hour * 60 +
          endTimeParsed.minute -
          (startTimeParsed.hour * 60 + startTimeParsed.minute),
      };
    });
  });
};

// ============= DOWNLOAD FUNCTIONALITY =============
const useImageDownload = () => {
  const downloadAsImage = async (elementRef: HTMLDivElement | null) => {
    if (!elementRef) {
      alert("Element reference not found");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      const table = elementRef.querySelector("table");
      if (!table) throw new Error("Table not found");

      await drawScheduleOnCanvas(ctx, canvas, table);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `schedule-${moment().format("YYYY-MM-DD-HHmm")}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Canvas method failed:", error);
      downloadAsHTML(elementRef);
    }
  };

  const drawScheduleOnCanvas = async (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    table: HTMLTableElement
  ) => {
    const cellWidth = 120;
    const cellHeight = 60;
    const rows = table.querySelectorAll("tr");
    const cols = rows[0]?.querySelectorAll("th, td").length || 7;

    canvas.width = cols * cellWidth;
    canvas.height = rows.length * cellHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "11px Arial, sans-serif";
    ctx.textAlign = "center";

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("th, td");
      const isHeader = row.querySelector("th") !== null;

      cells.forEach((cell, colIndex) => {
        const x = colIndex * cellWidth;
        const y = rowIndex * cellHeight;

        if (isHeader) {
          drawCell(
            ctx,
            x,
            y,
            cellWidth,
            cellHeight,
            "#f3f4f6",
            cell.textContent?.trim() || "",
            "#000000"
          );
        } else if (colIndex === 0) {
          drawCell(
            ctx,
            x,
            y,
            cellWidth,
            cellHeight,
            "#f8f9fa",
            cell.textContent?.trim() || "",
            "#000000",
            true
          );
        } else {
          const bgColor =
            (cell as HTMLElement).style.backgroundColor || "#ffffff";
          drawCell(
            ctx,
            x,
            y,
            cellWidth,
            cellHeight,
            bgColor,
            cell.textContent?.trim() || "",
            "#ffffff",
            false,
            bgColor !== "#ffffff"
          );
        }
      });
    });
  };

  const drawCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    bgColor: string,
    text: string,
    textColor: string,
    isBold = false,
    isMultiline = false
  ) => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = textColor;
    ctx.font = `${isBold ? "bold " : ""}${
      isMultiline ? "10" : "11"
    }px Arial, sans-serif`;

    if (isMultiline && text) {
      const lines = text.split("\n").filter((line) => line.trim());
      lines.forEach((line, index) => {
        ctx.fillText(
          line,
          x + width / 2,
          y + height / 2 + index * 12 - (lines.length - 1) * 6
        );
      });
    } else {
      ctx.fillText(text, x + width / 2, y + height / 2 + 4);
    }
  };

  const downloadAsHTML = (elementRef: HTMLDivElement) => {
    try {
      const table = elementRef.querySelector("table");
      if (!table) return;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Class Schedule</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: white; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #666; padding: 8px; text-align: center; vertical-align: middle; }
        th { background-color: #f0f0f0; font-weight: bold; }
        .time-cell { background-color: #f8f8f8; font-weight: bold; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <h2>Class Schedule</h2>
    ${createTableHTML(table)}
    <p><em>Generated on ${new Date().toLocaleString()}</em></p>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `schedule-${moment().format("YYYY-MM-DD-HHmm")}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(
        'Downloaded as HTML file. You can open it in a browser and use "Print to PDF" or screenshot it.'
      );
    } catch (error) {
      console.error("HTML fallback failed:", error);
      alert("Download failed. Please try refreshing the page.");
    }
  };

  const createTableHTML = (originalTable: HTMLTableElement): string => {
    const rows = originalTable.querySelectorAll("tr");
    let tableHTML = "<table>";

    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      const isHeader = row.querySelector("th") !== null;

      tableHTML += "<tr>";
      cells.forEach((cell, colIndex) => {
        const tag = isHeader ? "th" : "td";
        const bgColor = (cell as HTMLElement).style.backgroundColor;
        const isTimeCell = colIndex === 0 && !isHeader;

        let text = cell.textContent?.trim() || "";
        if (cell.children.length > 0) {
          const courseCode =
            cell.querySelector(".font-medium")?.textContent?.trim() || "";
          const timeText =
            cell.querySelector(".text-xs")?.textContent?.trim() || "";
          text = courseCode + (timeText ? "<br/>" + timeText : "");
        }

        let style = "";
        if (bgColor && bgColor !== "rgb(255, 255, 255)") {
          style = ` style="background-color: ${bgColor}; color: white;"`;
        } else if (isTimeCell) {
          style = ' class="time-cell"';
        }

        tableHTML += `<${tag}${style}>${text}</${tag}>`;
      });
      tableHTML += "</tr>";
    });

    return tableHTML + "</table>";
  };

  return { downloadAsImage };
};

// ============= SCHEDULE TABLE COMPONENT =============
interface ScheduleTableProps {
  schedule: ScheduleSlot[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const { downloadAsImage } = useImageDownload();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeSlots = useMemo(() => {
    const slots: {
      time: string;
      display: string;
      hour: number;
      minute: number;
    }[] = [];
    for (let hour = 7; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const display = moment(time24, "HH:mm").format("h:mm A");
        slots.push({ time: time24, display, hour, minute });
      }
    }
    return slots;
  }, []);

  const courseColorMap = useMemo(
    () => createCourseColorMap(schedule),
    [schedule]
  );
  const scheduleEvents = useMemo(
    () => createScheduleEvents(schedule, courseColorMap),
    [schedule, courseColorMap]
  );

  const scheduleGrid = useMemo(() => {
    const grid: {
      [key: string]: Array<{
        courseCode: string;
        color: string;
        startTime: string;
        endTime: string;
        isStart: boolean;
        duration: number;
      }>;
    } = {};

    // Initialize grid
    timeSlots.forEach((slot) => {
      days.forEach((day) => {
        grid[`${day}-${slot.time}`] = [];
      });
    });

    // Fill grid with events
    scheduleEvents.forEach((event) => {
      const eventStartMinutes = event.startHour * 60 + event.startMinute;
      const eventEndMinutes = event.endHour * 60 + event.endMinute;

      timeSlots.forEach((slot) => {
        const slotMinutes = slot.hour * 60 + slot.minute;
        const nextSlotMinutes = slotMinutes + 30;

        if (
          eventStartMinutes < nextSlotMinutes &&
          eventEndMinutes > slotMinutes
        ) {
          const key = `${event.day}-${slot.time}`;
          const isStart =
            eventStartMinutes >= slotMinutes &&
            eventStartMinutes < nextSlotMinutes;

          grid[key].push({
            courseCode: event.courseCode,
            color: event.color,
            startTime: event.startTime,
            endTime: event.endTime,
            isStart,
            duration: event.duration,
          });
        }
      });
    });

    return grid;
  }, [scheduleEvents, timeSlots, days]);

  const copyScheduleText = () => {
    if (!tableRef.current) return;

    try {
      const table = tableRef.current.querySelector("table");
      if (!table) return;

      let scheduleText = "CLASS SCHEDULE\n\n";
      const rows = table.querySelectorAll("tr");

      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("th, td");
        const rowText = Array.from(cells)
          .map((cell) => (cell.textContent?.trim() || "").padEnd(15))
          .join("");
        scheduleText += rowText + "\n";

        if (rowIndex === 0) scheduleText += "=".repeat(80) + "\n";
      });

      navigator.clipboard
        .writeText(scheduleText)
        .then(() => alert("Schedule copied to clipboard!"))
        .catch(() => alert("Failed to copy to clipboard"));
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Class Schedule Table
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => downloadAsImage(tableRef.current)}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={copyScheduleText} variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={tableRef} className="bg-white p-4 rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 p-3 text-sm font-bold min-w-[100px] sticky left-0 z-10">
                    Time
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="border border-gray-300 bg-gray-100 p-3 text-sm font-bold min-w-[140px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot.time} className="h-12">
                    <td className="border border-gray-300 bg-gray-50 p-2 text-center text-xs font-medium sticky left-0 z-10">
                      {timeSlot.display}
                    </td>
                    {days.map((day) => {
                      const events =
                        scheduleGrid[`${day}-${timeSlot.time}`] || [];

                      if (events.length === 0) {
                        return (
                          <td
                            key={day}
                            className="border border-gray-300 bg-white h-12"
                          />
                        );
                      }

                      const primaryEvent = events[0];

                      return (
                        <td
                          key={day}
                          className="border border-gray-300 p-1 relative"
                          style={{
                            backgroundColor: primaryEvent.color,
                            backgroundImage:
                              events.length > 1
                                ? `linear-gradient(45deg, ${primaryEvent.color} 50%, ${events[1].color} 50%)`
                                : undefined,
                          }}
                        >
                          {primaryEvent.isStart && (
                            <div className="text-white text-center">
                              <div className="font-bold text-xs leading-tight">
                                {primaryEvent.courseCode}
                              </div>
                              <div className="text-[10px] opacity-90 mt-0.5">
                                {primaryEvent.startTime}
                              </div>
                              {primaryEvent.duration > 30 && (
                                <div className="text-[9px] opacity-75">
                                  {Math.round(
                                    (primaryEvent.duration / 60) * 2
                                  ) / 2}
                                  h
                                </div>
                              )}
                            </div>
                          )}

                          {events.length > 1 && (
                            <div
                              className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"
                              title={`Conflict: ${events
                                .map((e) => e.courseCode)
                                .join(", ")}`}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            {Object.entries(courseColorMap).map(([courseCode, color]) => (
              <div key={courseCode} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">{courseCode}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============= SCHEDULE HEADER =============
interface ScheduleHeaderProps {
  generatedSchedule: GeneratedSchedule;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  generatedSchedule,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        Generated Schedule
      </CardTitle>
      <div className="text-sm text-muted-foreground">
        {generatedSchedule.scheduledCourses} of {generatedSchedule.totalCourses}{" "}
        courses scheduled • Generated:{" "}
        {new Date(generatedSchedule.generatedAt).toLocaleString()}
      </div>
    </CardHeader>
  </Card>
);

// ============= MAIN SCHEDULE DISPLAY =============
interface ScheduleDisplayProps {
  generatedSchedule: GeneratedSchedule | null;
}

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
  generatedSchedule,
}) => {
  if (!generatedSchedule) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 space-y-6"
    >
      <ScheduleHeader generatedSchedule={generatedSchedule} />
      <ScheduleTable schedule={generatedSchedule.schedule} />

      {generatedSchedule.conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              Scheduling Conflicts ({generatedSchedule.conflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generatedSchedule.conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700"
                >
                  {conflict}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

// Demo with sample data
const sampleSchedule: GeneratedSchedule = {
  schedule: [
    {
      courseCode: "CMSC 123",
      startTime: "10:30 AM",
      endTime: "1:30 PM",
      days: ["Tuesday", "Thursday"],
    },
    {
      courseCode: "CMSC 142 B",
      startTime: "8:00 AM",
      endTime: "9:00 AM",
      days: ["Tuesday", "Friday"],
    },
    {
      courseCode: "MATH 141 A",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      days: ["Monday", "Thursday"],
    },
    {
      courseCode: "CMSC 130 D",
      startTime: "8:00 AM",
      endTime: "10:00 AM",
      days: ["Saturday"],
    },
    {
      courseCode: "PHYS 101",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      days: ["Monday", "Wednesday", "Friday"],
    },
  ],
  conflicts: [],
  totalCourses: 5,
  scheduledCourses: 5,
  algorithm: "Greedy",
  generatedAt: new Date().toISOString(),
};

export default function Demo() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Enhanced Schedule Display</h1>
      <ScheduleDisplay generatedSchedule={sampleSchedule} />
    </div>
  );
}
