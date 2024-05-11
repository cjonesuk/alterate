import { WorkflowDocument } from "../../lib/comfyui/workflow";
import { useForm } from "react-hook-form";
import { useAlterateStore } from "@/lib/store";
import { WorkflowEditorNodeInput } from "@/lib/editor-mapping";
import { InputTypes } from "@/lib/definition-mapping";
import { ImageReference } from "@/lib/comfyui/images";

function mapValue(value: unknown, input: WorkflowEditorNodeInput): string {
  if (input.definition.type === InputTypes.IMAGE_FILENAMES) {
    const valueActual = value as ImageReference;

    const path = [valueActual.subfolder, valueActual.filename]
      .filter(Boolean)
      .join("/");

    return `${path} [${valueActual.type}]`;
  }

  return `${value}`;
}

export function useWorkflowEditorForm() {
  const startJob = useAlterateStore((store) => store.startJob);
  const workspaceDefinition = useAlterateStore(
    (store) => store.workspace.definition
  );

  const nodeDefinitions = useAlterateStore(
    (store) => store.backend.definitions
  );

  const workspaceEditors = useAlterateStore((store) => store.workspace.editors);

  const form = useForm();

  const submit = form.handleSubmit(async (formData) => {
    if (!nodeDefinitions) {
      console.error("Node Definitions not available");
      return;
    }

    if (!workspaceEditors) {
      console.error("Workspace Editors not available");
      return;
    }

    // TODO: use Immer
    const workflowCopy = JSON.parse(
      JSON.stringify(workspaceDefinition?.workflow) // todo: fix
    ) as WorkflowDocument;

    const formNodeIds = Object.keys(formData);
    formNodeIds.forEach((nodeId) => {
      const formNode = formData[nodeId];
      const formNodeInputNames = Object.keys(formNode);
      const editor = workspaceEditors.find(
        (editor) => editor.nodeId === nodeId
      );

      if (!editor) {
        console.error("Editor not found for node", nodeId);
        return;
      }

      formNodeInputNames.forEach((inputName) => {
        const formNodeInputValue = formNode[inputName];
        console.log("INPUT", nodeId, inputName, formNodeInputValue, editor);

        const fieldId = `${nodeId}.${inputName}`;
        const inputDefinition = editor.inputs.find(
          (x) => x.fieldId === fieldId
        );

        if (!inputDefinition) {
          console.error("Input Definition not found", fieldId);
          return;
        }

        const mappedValue = mapValue(formNodeInputValue, inputDefinition);

        workflowCopy[nodeId].inputs[inputName] = mappedValue;
      });
    });

    const id = await startJob(workflowCopy);
    console.log("Job Queued:", id);
  });

  return { form, submit };
}

export type WorkflowEditorForm = ReturnType<
  typeof useWorkflowEditorForm
>["form"];

export type WorkflowEditorFormSubmit = ReturnType<
  typeof useWorkflowEditorForm
>["submit"];
