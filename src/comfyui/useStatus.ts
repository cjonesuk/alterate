import { useCallback, useState } from "react";

export interface ProgressSummary {
  promptId: string | null;

  step: number;
  steps: number;
  ratio: number;
  percentage: number;
}

export interface QueueSummary {
  length: number;
}

export interface StatusSummary {
  progress: ProgressSummary;
  queue: QueueSummary;
}

type StatusHook = StatusSummary & {
  updateProgress: (
    promptId: string,

    current: number,
    total: number
  ) => void;
  updateQueueLength: (input: number) => void;
};

export function useStatus(): StatusHook {
  const [progress, setProgress] = useState<ProgressSummary>({
    promptId: null,

    step: 0,
    steps: 0,
    ratio: 0,
    percentage: 0,
  });
  const [queue, setQueue] = useState<QueueSummary>({
    length: 0,
  });

  const updateProgress = useCallback(
    (promptId: string, current: number, total: number) => {
      const ratio = current / total;

      setProgress({
        promptId,
        step: current,
        steps: total,
        ratio: total > 0 ? ratio : 0,
        percentage: total > 0 ? ratio * 100 : 0,
      });
    },
    [setProgress]
  );

  const updateQueueLength = useCallback(
    (input: number) => {
      setQueue({
        length: input,
      });
    },
    [setQueue]
  );

  return {
    progress,
    queue,
    updateProgress,
    updateQueueLength,
  };
}
