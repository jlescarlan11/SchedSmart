import { Badge } from "@/components/ui/badge";
import { TimeSlot } from "@/types/scheduler";

// Time Slot Component
interface TimeSlotCardProps {
  slot: TimeSlot;
  index: number;
}

export const TimeSlotCard = ({ slot, index }: TimeSlotCardProps) => (
  <div className="p-3 bg-accent rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium text-sm">Option {index + 1}</span>
      <span className="text-sm text-muted-foreground">
        {slot.startTime} - {slot.endTime}
      </span>
    </div>
    <div className="flex flex-wrap gap-1">
      {slot.days.map((day) => (
        <Badge key={day} variant="outline" className="text-xs">
          {day}
        </Badge>
      ))}
    </div>
  </div>
);
