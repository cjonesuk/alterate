import { ProgressSummary } from "@/comfyui/useStatus";
import { Progress } from "@/components/ui/progress";

interface Props {
  progress: ProgressSummary;
}

export function JobProgress({ progress }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Progress value={progress.percentage} />
    </div>
  );
}
