import { useComfyUIWebsocket } from "../../comfyui/useComfyUIWebsocket";
import { Sidebar } from "../../components/layout/sidebar";
import { Button } from "../../components/ui/button";
import { FormProvider } from "../../components/ui/form";

import { useWorkflowEditor } from "./useWorkflowEditor";
import { WorkflowEditorPanel } from "./editor-panel";
import { JobProgress } from "./job-progress";
import { PreviewImage } from "./preview-image";

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
