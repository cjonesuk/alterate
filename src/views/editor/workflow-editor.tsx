import { WorkflowNodeEditorCard } from "../../WorkflowNodeEditorCard";
import { useComfyUIWebsocket } from "../../comfyui/useComfyUIWebsocket";
import { Sidebar } from "../../components/layout/sidebar";
import { Button } from "../../components/ui/button";
import { FormProvider } from "../../components/ui/form";

import { useWorkflowEditor } from "../../useWorkflowEditor";
import { JobProgress } from "./job-progress";
import { PreviewImage } from "./preview-image";

export function WorkflowEditorView() {
  const connection = useComfyUIWebsocket();
  const { isLoading, error, editors, form, submit } = useWorkflowEditor();

  if (isLoading) {
    return <div>Loading ComfyUI node definitions...</div>;
  }

  if (error) {
    return <div>Error loading ComfyUI node definitions: {error.message}</div>;
  }

  return (
    <FormProvider {...form}>
      <div className="w-full flex flex-row items-start p-4">
        <div className="flex-grow">
          <div className="flex flex-row flex-wrap justify-start gap-2 ">
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
        </div>

        <Sidebar>
          <PreviewImage src={connection.imageUrl} />

          <JobProgress percentage={connection.status.percentage} />

          <Button type="button" onClick={submit}>
            Queue Job
          </Button>
        </Sidebar>
      </div>
    </FormProvider>
  );
}
