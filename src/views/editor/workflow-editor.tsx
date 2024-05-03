import { Sidebar } from "../../components/layout/sidebar";
import { FormProvider } from "../../components/ui/form";

import { useWorkflowEditorForm } from "./form";
import { WorkflowEditorPanel } from "./editor-panel";
import { JobProgress } from "./job-progress";
import { LivePreviewImage } from "./preview-image";
import { QueueManager } from "./queue-manager";
import { useAlterateStore } from "@/lib/store";
import { ImageReferenceCard } from "./image-reference";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BackendSelectionView } from "../backends/backend-selection";
import { WorkflowSelectionView } from "../workflows/workflow-selection";

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

  const { form, submit } = useWorkflowEditorForm();

  if (!connected) {
    return <BackendSelectionView />;
  }

  if (!workspaceDefinition) {
    return <WorkflowSelectionView />;
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
