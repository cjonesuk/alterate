import { WorkflowDocument } from "../../lib/comfyui/workflow";
import { useForm } from "react-hook-form";
import { useAlterateStore } from "@/lib/store";

export function useWorkflowEditor() {
  const definitions = useAlterateStore((store) => store.backend.definitions);
  const sendPrompt = useAlterateStore((store) => store.sendPrompt);
  const workspaceDefinition = useAlterateStore(
    (store) => store.workspace.definition
  );
  const editors = useAlterateStore((store) => store.workspace.editors);

  const form = useForm();

  const submit = form.handleSubmit(async (formData) => {
    // TODO: use Immer
    const workflowCopy = JSON.parse(
      JSON.stringify(workspaceDefinition?.workflow) // todo: fix
    ) as WorkflowDocument;

    const formNodeIds = Object.keys(formData);
    formNodeIds.forEach((nodeId) => {
      const formNode = formData[nodeId];
      const formNodeInputNames = Object.keys(formNode);

      formNodeInputNames.forEach((inputName) => {
        const formNodeInputValue = formNode[inputName];

        workflowCopy[nodeId].inputs[inputName] = formNodeInputValue;
      });
    });

    const id = await sendPrompt(workflowCopy);
    console.log("Job Queued:", id);
  });

  return { definitions, editors, form, submit };
}

export type WorkflowEditorHook = ReturnType<typeof useWorkflowEditor>;

export type WorkflowEditorForm = ReturnType<typeof useWorkflowEditor>["form"];
