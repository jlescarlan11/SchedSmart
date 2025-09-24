import { useState, useCallback } from "react";

export type StepType = "basic" | "timeslots" | "dependencies" | "complete";

export interface StepFlowState {
  currentStep: StepType;
  canProceed: boolean;
  canGoBack: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: StepType) => void;
  resetSteps: () => void;
}

export const useStepFlow = () => {
  const [currentStep, setCurrentStep] = useState<StepType>("basic");

  const goToNextStep = useCallback(() => {
    const stepOrder: StepType[] = ["basic", "timeslots", "dependencies", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    const stepOrder: StepType[] = ["basic", "timeslots", "dependencies", "complete"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: StepType) => {
    setCurrentStep(step);
  }, []);

  const resetSteps = useCallback(() => {
    setCurrentStep("basic");
  }, []);

  const canProceed = currentStep !== "complete";
  const canGoBack = currentStep !== "basic";

  return {
    currentStep,
    canProceed,
    canGoBack,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetSteps,
  };
};
