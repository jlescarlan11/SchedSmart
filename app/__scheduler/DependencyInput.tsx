"use client";

import { Link, Plus, Trash2 } from "lucide-react";
import React, { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
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

import type { Course, DependencyFormData } from "@/types/scheduler";
import { formatSlot } from "@/utils";

interface DependencyInputProps {
  form: UseFormReturn<DependencyFormData>;
  currentCourse: Course;
  courses: Course[];
  onSubmit: (data: DependencyFormData) => void;
  onRemoveDependency: (index: number) => void;
  currentSlotIndex: number | null;
}

export const DependencyInput: React.FC<DependencyInputProps> = ({
  form,
  currentCourse,
  courses,
  onSubmit,
  onRemoveDependency,
  currentSlotIndex,
}) => {
  // Memoized calculations to avoid repeated computations
  const { availableCourses, currentSlotDependencies, selectedCourse } =
    useMemo(() => {
      const available = courses.filter(
        (c) => c.courseCode !== currentCourse.courseCode
      );

      const selectedCourseCode = form.watch("dependentCourseCode");
      const selected = courses.find((c) => c.courseCode === selectedCourseCode);

      // Get dependencies for current course and slot
      const dependencies =
        currentCourse.dependencies?.filter(
          (dep) =>
            dep.courseCode === currentCourse.courseCode &&
            dep.slotIndex === currentSlotIndex
        ) ?? [];

      return {
        availableCourses: available,
        currentSlotDependencies: dependencies,
        selectedCourse: selected,
      };
    }, [courses, currentCourse, currentSlotIndex, form]);

  const handleCourseChange = (courseCode: string) => {
    form.setValue("dependentCourseCode", courseCode);
    form.resetField("dependentSlotIndex");
  };

  const handleSlotChange = (slotValue: string) => {
    const slotIndex = parseInt(slotValue, 10);
    if (!isNaN(slotIndex)) {
      form.setValue("dependentSlotIndex", slotIndex);
    }
  };

  // Early return if no slot is selected
  if (currentSlotIndex === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Course Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add a time slot first, then select it to configure dependencies.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentSlot = currentCourse.availableSlots[currentSlotIndex];
  const isFormValid =
    selectedCourse && form.watch("dependentSlotIndex") !== undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Course Dependencies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Configure which courses must be scheduled together with{" "}
          <Badge variant="outline">{currentCourse.courseCode}</Badge> slot{" "}
          {currentSlotIndex + 1}:
          <br />
          <span className="text-xs">
            {currentSlot ? formatSlot(currentSlot) : "Invalid slot"}
          </span>
        </div>

        {/* Add Dependency Form */}
        {availableCourses.length > 0 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dependentCourseCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dependent Course</FormLabel>
                      <Select
                        onValueChange={handleCourseChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCourses.map((course) => (
                            <SelectItem
                              key={course.courseCode}
                              value={course.courseCode}
                            >
                              {course.courseCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dependentSlotIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dependent Time Slot</FormLabel>
                      <Select
                        onValueChange={handleSlotChange}
                        value={field.value?.toString() ?? ""}
                        disabled={!selectedCourse}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedCourse?.availableSlots.map((slot, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              Slot {index + 1}: {formatSlot(slot)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="sm"
                disabled={!isFormValid}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Dependency
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
            No other courses available. Add more courses to create dependencies.
          </div>
        )}

        {/* Current Dependencies */}
        {currentSlotDependencies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Current Dependencies ({currentSlotDependencies.length}):
            </h4>
            <div className="space-y-2">
              {currentSlotDependencies.map((dependency, index) => {
                const depCourse = courses.find(
                  (c) => c.courseCode === dependency.dependentCourseCode
                );

                return (
                  <div
                    key={`${dependency.dependentCourseCode}-${dependency.dependentSlotIndex}`}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="text-sm">
                      <Badge variant="secondary" className="mr-2">
                        {dependency.dependentCourseCode}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Slot {dependency.dependentSlotIndex + 1}:
                      </span>
                      <br />
                      <span className="text-xs">
                        {depCourse
                          ? formatSlot(
                              depCourse.availableSlots[
                                dependency.dependentSlotIndex
                              ]
                            )
                          : "Course not found"}
                      </span>
                    </div>
                    <Button
                      onClick={() => onRemoveDependency(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      type="button"
                      aria-label={`Remove dependency on ${dependency.dependentCourseCode}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
