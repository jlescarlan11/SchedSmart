// Canvas schedule image generation extracted from ScheduleDisplay

type ScheduleSlot = {
  activityCode: string; // Activity name/code
  room?: string;
  startTime: string;
  endTime: string;
  days: string[];
};

const COLORS = {
  primary: "#2A2A2A",        // Dark gray for activity blocks
  primaryLight: "#404040",   // Medium-dark gray
  background: "#E8E8E8",     // Light gray background
  headerBg: "#D0D0D0",       // Medium-light gray for headers
  border: "#B0B0B0",         // Light gray borders
  borderStrong: "#909090",   // Darker gray for strong borders
  text: "#000000",          // Black text for light backgrounds
  textLight: "#606060",      // Dark gray for light text
  white: "#FFFFFF",         // White text for dark activity blocks
};

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const parseTime = (time: string): number => {
  const [timePart, period] = time.trim().split(" ");
  const [hours, minutes = "0"] = timePart.split(":");
  let hour = parseInt(hours);
  const minute = parseInt(minutes);
  if (period?.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (period?.toUpperCase() === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
};

const formatHourForDisplay = (hour: number): string => {
  if (hour === 0) return "12";
  if (hour <= 12) return hour.toString();
  return (hour - 12).toString();
};

const createTimeSlots = () => {
  const slots: Array<{
    hour: number;
    isFirstHalf: boolean;
    display: string;
    startMinutes: number;
    endMinutes: number;
    slotKey: string;
  }> = [];
  for (let hour = 7; hour <= 18; hour++) {
    const currentHour = formatHourForDisplay(hour);
    const nextHour = formatHourForDisplay(hour + 1);
    const displayTime = `${currentHour}-${nextHour}`;
    slots.push({ hour, isFirstHalf: true, display: displayTime, startMinutes: hour * 60, endMinutes: hour * 60 + 30, slotKey: `${hour}-0` });
    slots.push({ hour, isFirstHalf: false, display: displayTime, startMinutes: hour * 60 + 30, endMinutes: (hour + 1) * 60, slotKey: `${hour}-1` });
  }
  return slots;
};

export const generateScheduleImage = async (schedule: ScheduleSlot[]): Promise<void> => {
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

  const scheduleGrid: Record<string, { course: ScheduleSlot; isStart: boolean; rowSpan: number } | null> = {};

  timeSlots.forEach((slot) => {
    WEEKDAYS.forEach((day) => {
      scheduleGrid[`${day}-${slot.slotKey}`] = null;
    });
  });

  schedule.forEach((activity) => {
    const startMinutes = parseTime(activity.startTime);
    const endMinutes = parseTime(activity.endTime);
    const durationMinutes = endMinutes - startMinutes;
    const duration30MinSlots = durationMinutes / 30;

    activity.days.forEach((day) => {
      const startHour = Math.floor(startMinutes / 60);
      const startMinuteInHour = startMinutes % 60;
      const startSlotIndex = startMinuteInHour < 30 ? 0 : 1;
      const startSlotKey = `${startHour}-${startSlotIndex}`;

      const gridKey = `${day}-${startSlotKey}`;
      if (Object.prototype.hasOwnProperty.call(scheduleGrid, gridKey)) {
        scheduleGrid[gridKey] = { course: activity, isStart: true, rowSpan: duration30MinSlots };

        let currentHour = startHour;
        let currentSlotIndex = startSlotIndex;
        for (let i = 1; i < duration30MinSlots; i++) {
          currentSlotIndex++;
          if (currentSlotIndex >= 2) {
            currentSlotIndex = 0;
            currentHour++;
          }
          const continueKey = `${day}-${currentHour}-${currentSlotIndex}`;
          if (Object.prototype.hasOwnProperty.call(scheduleGrid, continueKey)) {
            scheduleGrid[continueKey] = { course: activity, isStart: false, rowSpan: 0 };
          }
        }
      }
    });
  });

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, tableWidth, tableHeight);

  ctx.fillStyle = COLORS.headerBg;
  ctx.fillRect(0, 0, tableWidth, headerHeight);

  ctx.strokeStyle = COLORS.borderStrong;
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, tableWidth, headerHeight);

  ctx.fillStyle = COLORS.text;
  ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.strokeRect(0, 0, timeColumnWidth, headerHeight);
  ctx.fillText("Time", timeColumnWidth / 2, headerHeight / 2);

  WEEKDAYS.forEach((day, index) => {
    const x = timeColumnWidth + index * cellWidth;
    ctx.strokeRect(x, 0, cellWidth, headerHeight);
    ctx.fillText(day, x + cellWidth / 2, headerHeight / 2);
  });

  timeSlots.forEach((slot, slotIndex) => {
    const rowY = headerHeight + slotIndex * cellHeight;
    if (slot.isFirstHalf) {
      ctx.fillStyle = COLORS.headerBg;
      ctx.fillRect(0, rowY, timeColumnWidth, cellHeight * 2);
      ctx.strokeStyle = COLORS.borderStrong;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, rowY, timeColumnWidth, cellHeight * 2);
      ctx.fillStyle = COLORS.text;
      ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(slot.display, timeColumnWidth / 2, rowY + cellHeight);
    }

    WEEKDAYS.forEach((day, dayIndex) => {
      const cellX = timeColumnWidth + dayIndex * cellWidth;
      const gridData = scheduleGrid[`${day}-${slot.slotKey}`];
      if (gridData?.isStart) {
        const blockHeight = gridData.rowSpan * cellHeight;
        ctx.fillStyle = COLORS.primary;
        ctx.fillRect(cellX, rowY, cellWidth, blockHeight);
        ctx.strokeStyle = COLORS.borderStrong;
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, rowY, cellWidth, blockHeight);
        ctx.fillStyle = COLORS.white;
        ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(gridData.course.activityCode, cellX + cellWidth / 2, rowY + blockHeight / 2 - 6);
        if (gridData.course.room) {
          ctx.font = "9px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
          ctx.fillText(gridData.course.room, cellX + cellWidth / 2, rowY + blockHeight / 2 + 6);
        }
      } else if (!gridData) {
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(cellX, rowY, cellWidth, cellHeight);
        ctx.strokeStyle = COLORS.borderStrong;
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, rowY, cellWidth, cellHeight);
      }
    });
  });

  return new Promise((resolve) => {
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
      resolve();
    }, "image/png");
  });
};


