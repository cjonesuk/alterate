import { Sidebar } from "../../components/layout/sidebar";
import { FormProvider } from "../../components/ui/form";

import { useWorkflowEditorForm } from "./form";
import { WorkflowEditorPanel } from "./editor-panel";
import { JobProgress } from "./job-progress";
import { LivePreviewImage } from "./preview-image";
import { QueueManager } from "./queue-manager";
import { useAlterateStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ImageReferenceCard } from "./image-reference";

export function WorkflowEditorView() {
  const connected = useAlterateStore(
    (store) => store.backend.websocket !== null
  );

  const workspaceDefinition = useAlterateStore(
    (store) => store.workspace.definition
  );

  const outputImages = useAlterateStore(
    (store) => store.workspace.outputImages
  );

  const connect = useAlterateStore((store) => store.connectToDefault);
  const loadWorkspace = useAlterateStore((store) => store.loadDefaultWorkspace);

  const { form, submit } = useWorkflowEditorForm();

  if (!connected) {
    return (
      <div>
        <Button onClick={connect}>Connect</Button>
      </div>
    );
  }

  if (!workspaceDefinition) {
    return (
      <div>
        <Button onClick={loadWorkspace}>Load Workflow</Button>
      </div>
    );
  }

  const images = outputImages.map((image) => {
    return <ImageReferenceCard key={image.filename} image={image} />;
  });

  return (
    <FormProvider {...form}>
      <div className="w-full flex flex-row items-start p-4">
        <div className="flex-grow">
          <WorkflowEditorPanel form={form} />
        </div>

        <div>{images}</div>

        <Sidebar>
          <LivePreviewImage />
          <JobProgress />
          <QueueManager submit={submit} />
        </Sidebar>
      </div>
    </FormProvider>
  );
}
