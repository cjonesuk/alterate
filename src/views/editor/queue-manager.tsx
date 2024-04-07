import { Button } from "@/components/ui/button";
import { WorkflowEditorHook } from "./use-workflow-editor";
import { QueueSummary } from "@/comfyui/useStatus";
import { getHttpUrl } from "@/comfyui/api";

interface Props {
  submit: WorkflowEditorHook["submit"];
  queue: QueueSummary;
}

export function QueueManager({ submit, queue }: Props) {
  const comfyuiUrl = getHttpUrl();
  return (
    <div className="flex flex-col gap-2">
      <p>Jobs: {`${queue.length}`}</p>
      <Button type="button" onClick={submit}>
        Queue Job
      </Button>
      <Button asChild variant="outline">
        <a href={comfyuiUrl} target="_blank">
          Open ComfyUI
        </a>
      </Button>
    </div>
  );
}
