import { WorkflowNodeEditorCard } from "./WorkflowNodeEditorCard";
import { useComfyUIWebsocket } from "./comfyui/useComfyUIWebsocket";
import { Button } from "./components/ui/button";
import { Form } from "./components/ui/form";

import { useWorkflowEditor } from "./useWorkflowEditor";

export function ComfyUI() {
  const { imageUrl } = useComfyUIWebsocket();
  const { isLoading, error, editors, form, submit } = useWorkflowEditor();

  if (isLoading) {
    return <div>Loading ComfyUI node definitions...</div>;
  }

  if (error) {
    return <div>Error loading ComfyUI node definitions: {error.message}</div>;
  }

  const displayImage = imageUrl ? <img src={imageUrl} /> : null;

  return (
    <div>
      <h2>Alterate</h2>

      <div>{displayImage}</div>

      <Form {...form}>
        <Button type="button" onClick={submit}>
          Queue Job
        </Button>

        <div className="flex flex-row flex-wrap justify-start gap-2 p-2">
          {editors?.map((editor) => {
            return (
              <WorkflowNodeEditorCard
                key={editor.nodeId}
                editor={editor}
                form={form}
              />
            );
          })}
        </div>
      </Form>
    </div>
  );
}
