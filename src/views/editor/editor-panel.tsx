import { useAlterateStore } from "@/lib/store";
import { NodeEditorSection } from "@/views/editor/node-editor-card";
import { WorkflowEditorForm } from "@/views/editor/form";

type WorkflowEditorPanelProps = {
  form: WorkflowEditorForm;
};

export function WorkflowEditorPanel({ form }: WorkflowEditorPanelProps) {
  const editors = useAlterateStore((store) => store.workspace.editors);

  const editorCards = editors?.map((editor) => {
    return (
      <NodeEditorSection key={editor.nodeId} editor={editor} form={form} />
    );
  });

  return (
    <div className="flex flex-col justify-start gap-2 min-h-[200px] max-w-[500px]">
      {!editorCards && <div>Not Available</div>}

      {editorCards && <div className="flex flex-col gap-4 ">{editorCards}</div>}
    </div>
  );
}
