"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TimeSlot } from "@/types/scheduler";
import { ANIMATION_CONFIG } from "@/constants/scheduler";
import { getDayAbbreviation } from "@/utils";

interface TimeSlotListProps {
  slots: TimeSlot[];
  variant?: "interactive" | "compact";
  onRemoveSlot?: (index: number) => void;
  onSelectSlot?: (index: number) => void;
  selectedSlotIndex?: number | null;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({
  slots,
  variant = "interactive",
  onRemoveSlot,
  onSelectSlot,
  selectedSlotIndex,
}) => {
  if (slots.length === 0) return null;

  const isInteractive = variant === "interactive";

  return (
    <AnimatePresence>
      <motion.div {...ANIMATION_CONFIG.expandHeight}>
        {isInteractive && (
          <div className="flex items-center justify-between mb-3 flex-wrap">
            <h4 className="font-medium">Time Slots:</h4>
          </div>
        )}

        <div className="space-y-2">
          {slots.map((slot, index) => (
            <motion.div
              key={index}
              {...ANIMATION_CONFIG.slideInLeft}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedSlotIndex === index 
                  ? "bg-primary/10 border-primary" 
                  : "bg-accent border-transparent hover:bg-accent/80"
              }`}
              onClick={() => onSelectSlot?.(index)}
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
                {selectedSlotIndex === index && (
                  <Badge variant="default" className="text-xs ml-2">
                    Selected for Dependencies
                  </Badge>
                )}
              </div>

              {isInteractive && onRemoveSlot && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSlot(index);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TimeSlotList;
