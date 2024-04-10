import { Sidebar } from "../../components/layout/sidebar";
import { FormProvider } from "../../components/ui/form";

import { useWorkflowEditor } from "./use-workflow-editor";
import { WorkflowEditorPanel } from "./editor-panel";
import { JobProgress } from "./job-progress";
import { LivePreviewImage } from "./preview-image";
import { QueueManager } from "./queue-manager";
import { useAlterateStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function WorkflowEditorView() {
  const workflowEditor = useWorkflowEditor();

  const connected = useAlterateStore(
    (store) => store.backend.websocket !== null
  );
  const connect = useAlterateStore((store) => store.connectToDefault);

  if (!connected) {
    return (
      <div>
        <Button onClick={connect}>Connect</Button>
      </div>
    );
  }

  return (
    <FormProvider {...workflowEditor.form}>
      <div className="w-full flex flex-row items-start p-4">
        <div className="flex-grow">
          <WorkflowEditorPanel {...workflowEditor} />
        </div>

        <Sidebar>
          <LivePreviewImage />

          <JobProgress />

          <QueueManager submit={workflowEditor.submit} />
        </Sidebar>
      </div>
    </FormProvider>
  );
}
