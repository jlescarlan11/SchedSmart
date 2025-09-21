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
}

const TimeSlotItem: React.FC<{
  slot: TimeSlot;
  index: number;
  onRemove: (index: number) => void;
}> = ({ slot, index, onRemove }) => (
  <motion.div
    {...ANIMATION_CONFIG.slideInLeft}
    transition={{ delay: index * 0.1 }}
    className="flex items-center justify-between bg-accent p-3 rounded-lg"
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
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onRemove(index)}
      className="text-destructive hover:text-destructive"
    >
      <X className="h-4 w-4" />
    </Button>
  </motion.div>
);

export const TimeSlotDisplay: React.FC<TimeSlotDisplayProps> = ({
  slots,
  onRemoveSlot,
}) => {
  if (slots.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div {...ANIMATION_CONFIG.expandHeight}>
        <h4 className="font-medium mb-3">Time Slot Options:</h4>
        <div className="space-y-2">
          {slots.map((slot, index) => (
            <TimeSlotItem
              key={index}
              slot={slot}
              index={index}
              onRemove={onRemoveSlot}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
