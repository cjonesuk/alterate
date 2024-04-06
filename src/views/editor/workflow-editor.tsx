import { WorkflowNodeEditorCard } from "../../WorkflowNodeEditorCard";
import { useComfyUIWebsocket } from "../../comfyui/useComfyUIWebsocket";
import { Sidebar } from "../../components/layout/sidebar";
import { Button } from "../../components/ui/button";
import { FormProvider } from "../../components/ui/form";

import { WorkflowEditorHook, useWorkflowEditor } from "../../useWorkflowEditor";
import { JobProgress } from "./job-progress";
import { PreviewImage } from "./preview-image";

type WorkflowEditorPanelProps = WorkflowEditorHook;

function WorkflowEditorPanel({
  isLoading,
  error,
  editors,
  form,
}: WorkflowEditorPanelProps) {
  const editorCards = editors?.map((editor) => {
    return (
      <WorkflowNodeEditorCard key={editor.nodeId} editor={editor} form={form} />
    );
  });

  return (
    <div className="flex flex-row flex-wrap justify-start gap-2 min-h-[200px]">
      {isLoading && <div>Loading ComfyUI node definitions...</div>}

      {error && (
        <div>Error loading ComfyUI node definitions: {error.message}</div>
      )}

      {editorCards}
    </div>
  );
}

export function WorkflowEditorView() {
  const connection = useComfyUIWebsocket();
  const workflowEditor = useWorkflowEditor();

  return (
    <FormProvider {...workflowEditor.form}>
      <div className="w-full flex flex-row items-start p-4">
        <div className="flex-grow">
          <WorkflowEditorPanel {...workflowEditor} />
        </div>

        <Sidebar>
          <PreviewImage src={connection.imageUrl} />

          <JobProgress percentage={connection.status.percentage} />

          <Button type="button" onClick={workflowEditor.submit}>
            Queue Job
          </Button>
        </Sidebar>
      </div>
    </FormProvider>
  );
}
