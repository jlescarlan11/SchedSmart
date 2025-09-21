import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAY_PRESETS, DAYS_OF_WEEK, TIME_OPTIONS } from "@/constants/scheduler";
import { TimeSlotFormData } from "@/types/scheduler";
import { getDayAbbreviation } from "@/utils/dateHelpers";
import React from "react";
import { Control } from "react-hook-form";

interface TimeSlotSelectorProps {
  form: {
    control: Control<TimeSlotFormData>;
  };
  selectedDays: string[];
  handleDayToggle: (day: string) => void;
  handlePresetSelect: (days: string[]) => void;
  isPresetSelected: (days: string[]) => boolean;
}

interface TimeSelectFieldProps {
  control: Control<TimeSlotFormData>;
  name: keyof TimeSlotFormData;
  label: string;
  placeholder: string;
}

interface ButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const TimeSelectField: React.FC<TimeSelectFieldProps> = ({
  control,
  name,
  label,
  placeholder,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value as string}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {TIME_OPTIONS.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

// Consolidated button component to reduce redundancy
const SelectableButton: React.FC<ButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => (
  <Button
    type="button"
    variant={isSelected ? "default" : "outline"}
    size="sm"
    onClick={onClick}
  >
    {label}
  </Button>
);

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  form,
  selectedDays,
  handleDayToggle,
  handlePresetSelect,
  isPresetSelected,
}) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="days"
        render={() => (
          <FormItem>
            <FormLabel>Days</FormLabel>
            <FormControl>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Common Combinations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DAY_PRESETS.map((preset) => (
                      <SelectableButton
                        key={preset.label}
                        label={preset.label}
                        isSelected={isPresetSelected(preset.days)}
                        onClick={() => handlePresetSelect(preset.days)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Or select individual days:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectableButton
                        key={day}
                        label={getDayAbbreviation(day)}
                        isSelected={selectedDays.includes(day)}
                        onClick={() => handleDayToggle(day)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeSelectField
          control={form.control}
          name="startTime"
          label="Start Time"
          placeholder="Select start time"
        />
        <TimeSelectField
          control={form.control}
          name="endTime"
          label="End Time"
          placeholder="Select end time"
        />
      </div>
    </div>
  );
};
