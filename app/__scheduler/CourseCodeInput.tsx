"use client";

import { BookOpen } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

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
import type { CourseFormData } from "@/types/scheduler";

interface CourseCodeInputProps {
  form: UseFormReturn<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  onCodeChange: (courseCode: string) => void;
}

export const CourseCodeInput: React.FC<CourseCodeInputProps> = ({
  form,
  onSubmit,
  onCodeChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Add New Course
        </CardTitle>
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
                      placeholder="e.g., CS101, MATH201"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onCodeChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
