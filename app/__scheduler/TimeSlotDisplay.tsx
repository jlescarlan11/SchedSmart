import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TimeSlot } from "@/types/scheduler";
import { ANIMATION_CONFIG } from "@/constants/scheduler";
import { getDayAbbreviation } from "@/utils/dateHelpers";

interface TimeSlotDisplayProps {
  slots: TimeSlot[];
  onRemoveSlot: (index: number) => void;
  onSelectSlot?: (index: number) => void;
  selectedSlotIndex?: number | null;
}

const TimeSlotItem: React.FC<{
  slot: TimeSlot;
  index: number;
  onRemove: (index: number) => void;
  onSelect?: (index: number) => void;
  isSelected?: boolean;
}> = ({ slot, index, onRemove, onSelect, isSelected }) => (
  <motion.div
    {...ANIMATION_CONFIG.slideInLeft}
    transition={{ delay: index * 0.1 }}
    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors cursor-pointer ${
      isSelected
        ? "bg-primary/10 border-primary"
        : "bg-accent border-transparent hover:border-primary/30"
    }`}
    onClick={() => onSelect?.(index)}
  >
    <div className="flex flex-wrap gap-1">
      {slot.days.map((day) => (
        <Badge key={day} variant="secondary" className="text-xs">
          {getDayAbbreviation(day)}
        </Badge>
      ))}
      <span className="text-sm font-medium ml-2">
        {slot.startTime} - {slot.endTime}
      </span>
      {isSelected && (
        <Badge variant="default" className="text-xs ml-2">
          Selected for Dependencies
        </Badge>
      )}
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onRemove(index);
      }}
      className="text-destructive hover:text-destructive"
    >
      <X className="h-4 w-4" />
    </Button>
  </motion.div>
);

export const TimeSlotDisplay: React.FC<TimeSlotDisplayProps> = ({
  slots,
  onRemoveSlot,
  onSelectSlot,
  selectedSlotIndex,
}) => {
  if (slots.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div {...ANIMATION_CONFIG.expandHeight}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Time Slot Options:</h4>
          {onSelectSlot && (
            <span className="text-xs text-muted-foreground">
              Click to configure dependencies
            </span>
          )}
        </div>
        <div className="space-y-2">
          {slots.map((slot, index) => (
            <TimeSlotItem
              key={index}
              slot={slot}
              index={index}
              onRemove={onRemoveSlot}
              onSelect={onSelectSlot}
              isSelected={selectedSlotIndex === index}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
