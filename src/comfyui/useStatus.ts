import { useCallback, useState } from "react";

export interface StatusSummary {
  currentSteps: number;
  totalSteps: number;
  percentage: number;
}

type StatusHook = StatusSummary & {
  updateProgress: (current: number, total: number) => void;
};

export function useStatus(): StatusHook {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const updateProgress = useCallback(
    (current: number, total: number) => {
      setCurrentSteps(current);
      setTotalSteps(total);
    },
    [setCurrentSteps, setTotalSteps]
  );

  const ratio = totalSteps > 0 ? currentSteps / totalSteps : 0;
  const percentage = ratio * 100;

  return {
    currentSteps,
    totalSteps,
    percentage,
    updateProgress,
  };
}
