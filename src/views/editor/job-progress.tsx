import { Progress } from "@/components/ui/progress";

interface Props {
  percentage: number;
}

export function JobProgress({ percentage }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Progress value={percentage} />
    </div>
  );
}
