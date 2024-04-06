import { NodeEditorCard } from "@/views/editor/node-editor-card";
import { WorkflowEditorHook } from "@/views/editor/use-workflow-editor";

type WorkflowEditorPanelProps = WorkflowEditorHook;

export function WorkflowEditorPanel({
  isLoading,
  error,
  editors,
  form,
}: WorkflowEditorPanelProps) {
  const editorCards = editors?.map((editor) => {
    return <NodeEditorCard key={editor.nodeId} editor={editor} form={form} />;
  });

  return (
    <div className="flex flex-row flex-wrap justify-start gap-2 min-h-[200px]">
      {isLoading && <div>Loading ComfyUI node definitions...</div>}

      {error && (
        <div>Error loading ComfyUI node definitions: {error.message}</div>
      )}

      {editorCards}
    </div>
  );
}
