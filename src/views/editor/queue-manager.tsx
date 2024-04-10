import { Button } from "@/components/ui/button";
import { WorkflowEditorHook } from "./use-workflow-editor";
import { getHttpUrl } from "@/comfyui/api";
import { useAlterateStore } from "@/lib/store";

interface Props {
  submit: WorkflowEditorHook["submit"];
}

export function QueueManager({ submit }: Props) {
  const queue = useAlterateStore((store) => store.backend.queue);

  // todo: move to store
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
