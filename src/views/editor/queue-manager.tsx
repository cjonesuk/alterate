import { Button } from "@/components/ui/button";
import { WorkflowEditorHook } from "./use-workflow-editor";
import { QueueSummary } from "@/comfyui/useStatus";

interface Props {
  submit: WorkflowEditorHook["submit"];
  queue: QueueSummary;
}

export function QueueManager({ submit, queue }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p>Jobs: {`${queue.length}`}</p>
      <Button type="button" onClick={submit}>
        Queue Job
      </Button>
    </div>
  );
}
