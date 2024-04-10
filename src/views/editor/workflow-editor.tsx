import { Sidebar } from "../../components/layout/sidebar";
import { FormProvider } from "../../components/ui/form";

import { useWorkflowEditor } from "./use-workflow-editor";
import { WorkflowEditorPanel } from "./editor-panel";
import { JobProgress } from "./job-progress";
import { PreviewImage } from "./preview-image";
import { QueueManager } from "./queue-manager";
import { useAlterateStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

const clientId = uuidv4();

export function WorkflowEditorView() {
  const workflowEditor = useWorkflowEditor();

  const imageUrl = useAlterateStore((store) => store.backend.liveImageUrl);
  const progress = useAlterateStore((store) => store.backend.progress);

  const connected = useAlterateStore(
    (store) => store.backend.websocket !== null
  );
  const connect = useAlterateStore((store) => store.connect);

  const handleConnect = () => {
    connect({
      machineName: "localhost",
      port: 8188,
      clientId,
    });
  };

  if (!connected) {
    return (
      <div>
        <Button onClick={handleConnect}>Connect</Button>
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
          <PreviewImage src={imageUrl} />

          <JobProgress progress={progress} />

          <QueueManager submit={workflowEditor.submit} />
        </Sidebar>
      </div>
    </FormProvider>
  );
}
