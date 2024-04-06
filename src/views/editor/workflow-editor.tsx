import { useComfyUIWebsocket } from "../../comfyui/useComfyUIWebsocket";
import { Sidebar } from "../../components/layout/sidebar";
import { FormProvider } from "../../components/ui/form";

import { useWorkflowEditor } from "./use-workflow-editor";
import { WorkflowEditorPanel } from "./editor-panel";
import { JobProgress } from "./job-progress";
import { PreviewImage } from "./preview-image";
import { QueueManager } from "./queue-manager";

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

          <JobProgress progress={connection.progress} />

          <QueueManager
            submit={workflowEditor.submit}
            queue={connection.queue}
          />
        </Sidebar>
      </div>
    </FormProvider>
  );
}
