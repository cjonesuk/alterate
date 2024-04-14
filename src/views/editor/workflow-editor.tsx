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
import basic_workflow_data from "../../assets/basic_workflow.json";
import canny_workflow_data from "../../assets/canny_workflow.json";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  const loadWorkspace = useAlterateStore((store) => store.loadWorkspace);

  const { form, submit } = useWorkflowEditorForm();

  if (!connected) {
    return (
      <div>
        <Button onClick={connect}>Connect</Button>
      </div>
    );
  }

  const loadBasicWorkflow = async () => {
    await loadWorkspace({
      workflow: basic_workflow_data,
    });
  };

  const loadCannyWorkflow = async () => {
    await loadWorkspace({
      workflow: canny_workflow_data,
    });
  };

  if (!workspaceDefinition) {
    return (
      <div>
        <Button onClick={loadBasicWorkflow}>Basic Workflow</Button>
        <Button onClick={loadCannyWorkflow}>Canny Workflow</Button>
      </div>
    );
  }

  const images = outputImages.map((image) => {
    return <ImageReferenceCard key={image.filename} image={image} />;
  });

  return (
    <FormProvider {...form}>
      <div className="w-full h-full flex flex-row items-start p-4">
        <ScrollArea className="h-full">
          <WorkflowEditorPanel form={form} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <ScrollArea className="h-full flex-grow gap-4">
          {images}
          {images.length === 0 && <p>no images</p>}
        </ScrollArea>

        <Sidebar>
          <LivePreviewImage />
          <JobProgress />
          <QueueManager submit={submit} />
        </Sidebar>
      </div>
    </FormProvider>
  );
}
