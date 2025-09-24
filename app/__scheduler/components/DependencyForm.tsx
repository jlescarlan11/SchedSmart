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
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors p-4 md:p-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Link className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Dependencies</span>
                <Badge variant="secondary" className="flex-shrink-0">{currentSlotDependencies.length}</Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4 p-4 md:p-6">
            {/* Instructions */}
            {currentSlotIndex === null && (
              <div className="text-sm text-muted-foreground text-center p-4 bg-accent/30 rounded-lg">
                Click on a time slot above to select it for dependency management
              </div>
            )}
            
            {currentSlotIndex !== null && (
              <div className="text-sm text-muted-foreground text-center p-3 bg-primary/10 rounded-lg">
                Managing dependencies for Slot {currentSlotIndex + 1}
              </div>
            )}

            {/* Current Dependencies */}
            {currentSlotDependencies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Dependencies:</h4>
                <div className="space-y-2">
                  {currentSlotDependencies.map((dep, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">
                          {dep.dependentActivityCode}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          Slot {dep.dependentSlotIndex + 1}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => activityHandlers.removeDependency(index)}
                        className="ml-2 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Dependency */}
            {availableActivities.length > 0 && currentSlotIndex !== null && (
              <Form {...dependencyForm}>
                <form onSubmit={dependencyForm.handleSubmit(activityHandlers.onDependencySubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={dependencyForm.control}
                      name="dependentActivityCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dependent Activity</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full min-w-0">
                                <SelectValue placeholder="Select activity" className="truncate text-left">
                                  {field.value && (
                                    <div className="flex flex-col text-left">
                                      <span className="font-medium text-sm">{field.value}</span>
                                    
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px] overflow-y-auto">
                              {availableActivities.map((activity) => (
                                <SelectItem key={activity.activityCode} value={activity.activityCode} className="whitespace-normal">
                                  <div className="flex flex-col w-full">
                                    <span className="font-medium break-words">{activity.activityCode}</span>
                                    <span className="text-xs text-muted-foreground break-words">
                                      {activity.availableSlots.length} slots available
                                    </span>
                                  </div>
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
                            <FormLabel>Time Slot</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full min-w-0">
                                  <SelectValue placeholder="Select time slot" className="truncate text-left">
                                    {field.value !== undefined && selectedActivity && (
                                      <div className="flex flex-col text-left">
                                        <span className="font-medium text-sm">Slot {field.value + 1}</span>

                                      </div>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[200px] overflow-y-auto">
                                {selectedActivity?.availableSlots.map((slot, index) => (
                                  <SelectItem key={index} value={index.toString()} className="whitespace-normal">
                                    <div className="flex flex-col w-full">
                                      <span className="font-medium break-words">{formatSlot(slot)}</span>
                                      <span className="text-xs text-muted-foreground break-words">
                                        Slot {index + 1}
                                      </span>
                                    </div>
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

                  <Button type="submit" size="sm" className="w-full md:w-auto">
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
