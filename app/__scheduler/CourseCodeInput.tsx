"use client";

import React from "react";
import { BookOpen, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import type { CourseFormData } from "@/types/scheduler";

interface CourseCodeInputProps {
  form: UseFormReturn<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  onCodeChange: (code: string) => void;
  editingCourseIndex?: number | null;
  onCancelEdit?: () => void;
}

export const CourseCodeInput: React.FC<CourseCodeInputProps> = ({
  form,
  onSubmit,
  onCodeChange,
  editingCourseIndex,
  onCancelEdit,
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Information
          </CardTitle>
          {editingCourseIndex !== null && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Editing Mode</Badge>
              {onCancelEdit && (
                <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., CS-101, MATH-201"
                      className="uppercase"
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                        onCodeChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {editingCourseIndex !== null
                ? "Update Course Code"
                : "Set Course Code"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
