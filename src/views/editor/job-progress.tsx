import { Progress } from "@/components/ui/progress";
import { useAlterateStore } from "@/lib/store";

export function JobProgress() {
  const progress = useAlterateStore((store) => store.backend.progress);

  return (
    <div className="flex flex-col gap-2">
      <Progress value={progress.percentage} />
    </div>
  );
}
