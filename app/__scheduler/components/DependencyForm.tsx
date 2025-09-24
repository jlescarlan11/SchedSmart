"use client";

import React from "react";
import { Link, Plus, Trash2 } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

import { useSchedulerContext } from "@/contexts/SchedulerContext";
import { formatSlot } from "@/utils";

export const DependencyForm: React.FC = () => {
  const {
    currentActivity,
    currentSlotIndex,
    activities,
    dependencyForm,
    activityHandlers,
  } = useSchedulerContext();

  const [isOpen, setIsOpen] = React.useState(false);

  // Get current slot dependencies
  const currentSlotDependencies = currentActivity.dependencies?.filter(
    (dep) => dep.activityCode === currentActivity.activityCode && dep.slotIndex === currentSlotIndex
  ) || [];

  // Get available activities for dependencies (excluding current activity)
  const availableActivities = activities.filter(
    (activity) => activity.activityCode !== currentActivity.activityCode
  );

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Dependencies
                <Badge variant="secondary">{currentSlotDependencies.length}</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Instructions */}
            {currentSlotIndex === null && (
              <div className="text-sm text-muted-foreground text-center p-4 bg-accent/30 rounded">
                Click on a time slot above to select it for dependency management
              </div>
            )}
            
            {currentSlotIndex !== null && (
              <div className="text-sm text-muted-foreground text-center p-2 bg-primary/10 rounded">
                Managing dependencies for Slot {currentSlotIndex + 1}
              </div>
            )}

            {/* Current Dependencies */}
            {currentSlotDependencies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Dependencies:</h4>
                {currentSlotDependencies.map((dep, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                    <span className="text-sm">
                      {dep.dependentActivityCode} (Slot {dep.dependentSlotIndex + 1})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => activityHandlers.removeDependency(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Dependency */}
            {availableActivities.length > 0 && currentSlotIndex !== null && (
              <Form {...dependencyForm}>
                <form onSubmit={dependencyForm.handleSubmit(activityHandlers.onDependencySubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={dependencyForm.control}
                      name="dependentActivityCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dependent Activity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableActivities.map((activity) => (
                                <SelectItem key={activity.activityCode} value={activity.activityCode}>
                                  {activity.activityCode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={dependencyForm.control}
                      name="dependentSlotIndex"
                      render={({ field }) => {
                        const selectedActivity = availableActivities.find(
                          (activity) => activity.activityCode === dependencyForm.watch("dependentActivityCode")
                        );
                        
                        return (
                          <FormItem>
                            <FormLabel>Slot</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedActivity?.availableSlots.map((slot, index) => (
                                  <SelectItem key={index} value={index.toString()}>
                                    {formatSlot(slot)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <Button type="submit" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Dependency
                  </Button>
                </form>
              </Form>
            )}

            {availableActivities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No other activities available for dependencies.
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
