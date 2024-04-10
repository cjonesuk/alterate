import original_workflow_data from "../../assets/workflow_api.json";

import { WorkflowDocument } from "../../lib/comfyui/workflow";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAlterateStore } from "@/lib/store";
import { makeEditors } from "@/lib/editor-mapping";

export function useWorkflowEditor() {
  const definitions = useAlterateStore((store) => store.backend.definitionns);
  const sendPrompt = useAlterateStore((store) => store.sendPrompt);

  const form = useForm();

  const workflow = useMemo(
    () =>
      JSON.parse(JSON.stringify(original_workflow_data)) as WorkflowDocument,
    []
  );

  const editors = useMemo(() => {
    if (!definitions) {
      return null;
    }

    return makeEditors(workflow, definitions);
  }, [definitions, workflow]);

  const submit = form.handleSubmit(async (formData) => {
    // TODO: use Immer
    const workflowCopy = JSON.parse(
      JSON.stringify(workflow)
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
