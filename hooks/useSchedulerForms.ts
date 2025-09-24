import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityFormData, TimeSlotFormData, DependencyFormData } from "@/types/scheduler";
import { activitySchema, timeSlotSchema, dependencySchema } from "@/validation/scheduler";

/**
 * Consolidated forms hook
 * Replaces: useActivityForm
 */
export const useSchedulerForms = () => {
  const activityForm = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: { activityCode: "" },
  });

  const timeSlotForm = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: { days: [], startTime: "", endTime: "" },
  });

  const dependencyForm = useForm<DependencyFormData>({
    resolver: zodResolver(dependencySchema),
    defaultValues: {
      dependentActivityCode: "",
      dependentSlotIndex: 0,
    },
  });

  return {
    activityForm,
    timeSlotForm,
    dependencyForm,
  };
};
