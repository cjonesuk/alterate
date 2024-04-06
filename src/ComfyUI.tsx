import { ConeIcon } from "lucide-react";
import { WorkflowNodeEditorCard } from "./WorkflowNodeEditorCard";
import {
  StatusSummary,
  useComfyUIWebsocket,
} from "./comfyui/useComfyUIWebsocket";
import { AspectRatio } from "./components/ui/aspect-ratio";
import { Button } from "./components/ui/button";
import { FormProvider } from "./components/ui/form";
import { Progress } from "./components/ui/progress";

import { useWorkflowEditor } from "./useWorkflowEditor";

function PreviewImage({ src }: { src: string | undefined | null }) {
  return (
    <div className="w-[200px] min-w-[200px] min-h-[200px] flex border-2 rounded-md">
      {src && (
        <AspectRatio ratio={16 / 16}>
          <img
            src={src}
            alt="Preview image"
            className="rounded-md object-cover"
          />
        </AspectRatio>
      )}
      {!src && (
        <p className="rounded-md flex flex-row self-center justify-center flex-grow text-xs text-foreground  ">
          None Available
        </p>
      )}
    </div>
  );
}

interface JobProgressProps {
  percentage: number;
}

function JobProgress({ percentage }: JobProgressProps) {
  return (
    <div className="flex flex-col gap-2">
      <Progress value={percentage} />
    </div>
  );
}

interface SidebarProps {
  children?: React.ReactNode | React.ReactNode[] | null | undefined;
}
function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="border-2 rounded-md p-2 flex flex-col gap-4">
      {children}
    </aside>
  );
}

export function ComfyUI() {
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
          <h2>Alterate</h2>

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
