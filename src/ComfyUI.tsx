import { WorkflowNodeEditorCard } from "./WorkflowNodeEditorCard";
import { useComfyUIWebsocket } from "./comfyui/useComfyUIWebsocket";
import { AspectRatio } from "./components/ui/aspect-ratio";
import { Button } from "./components/ui/button";
import { Form } from "./components/ui/form";
import { Progress } from "./components/ui/progress";

import { useWorkflowEditor } from "./useWorkflowEditor";

type LiveStatusProps = ReturnType<typeof useComfyUIWebsocket>;

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

function LiveStatus({ imageUrl, status }: LiveStatusProps) {
  return (
    <div className="flex flex-col gap-2">
      <PreviewImage src={imageUrl} />

      <Progress value={status.percentage * 100} />
    </div>
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
    <div className="w-full flex flex-row items-start p-4">
      <div className="flex-grow">
        <h2>Alterate</h2>

        <Form {...form}>
          <Button type="button" onClick={submit}>
            Queue Job
          </Button>

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
        </Form>
      </div>

      <aside className="">
        <LiveStatus {...connection} />
      </aside>
    </div>
  );
}
