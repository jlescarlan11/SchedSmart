import { Button } from "@/components/ui/button";
import { Course } from "@/types/scheduler";
import { TimeSlotCard } from "./TimeSlotCard";
import { LuX } from "react-icons/lu";

interface CourseCardProps {
  course: Course;
  index: number;
  onRemove: (index: number) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  index,
  onRemove,
}) => (
  <div className="border rounded-lg p-4 bg-card">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{course.courseCode}</h3>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {course.availableSlots.length} option
          {course.availableSlots.length !== 1 ? "s" : ""}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive h-8 w-8 p-0"
        >
          <LuX className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="space-y-3">
      {course.availableSlots.map((slot, slotIndex) => (
        <TimeSlotCard key={slotIndex} slot={slot} index={slotIndex} />
      ))}
    </div>
  </div>
);
