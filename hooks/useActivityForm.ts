import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CourseFormData, TimeSlotFormData } from "../types/scheduler";
import { courseSchema, timeSlotSchema } from "../validation/scheduler";

export const useActivityForm = () => {
  const courseForm = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { courseCode: "" },
  });

  const timeSlotForm = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: { days: [], startTime: "", endTime: "" },
  });

  return { courseForm, timeSlotForm };
};
