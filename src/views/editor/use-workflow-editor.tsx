import original_workflow_data from "../../assets/workflow_api.json";
import {
  AnyInputType,
  InputTypes,
  NodeDefinition,
  NodeDefinitionMap,
} from "../../comfyui/useObjectInfo";
import { WorkflowDocument, WorkflowNode } from "../../comfyui/types/workflow";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAlterateStore } from "@/lib/store";

export type WorkflowNodeValueKey = [string, string];

export type WorkflowEditorNodeInputKey = [string, string];

export interface WorkflowEditorNodeInput {
  key: WorkflowEditorNodeInputKey;
  fieldId: string;
  definition: AnyInputType;
  value: string | number;
}

export interface WorkflowEditorNode {
  nodeId: string;
  definition: NodeDefinition;
  node: WorkflowNode;
  inputs: WorkflowEditorNodeInput[];
}

function makeInputEditor(
  nodeId: string,
  node: WorkflowNode,
  definition: AnyInputType
): WorkflowEditorNodeInput {
  const key: WorkflowNodeValueKey = [nodeId, definition.name];
  const nodeValue = node.inputs[definition.name];

  if (nodeValue instanceof Array) {
    console.error("Array inputs not supported", {
      nodeId,
      node,
      input: definition,
    });
    throw new Error("Array inputs not supported");
  }

  return {
    key: key,
    fieldId: `${key[0]}.${[key[1]]}`,
    definition: definition,
    value: nodeValue,
  };
}

function makeNodeEditor(
  workflow: WorkflowDocument,
  definitions: NodeDefinitionMap,
  nodeId: string
): WorkflowEditorNode | null {
  const node = workflow[nodeId];

  const definition = definitions.get(node.class_type);

  if (!definition) {
    console.log(`No definition found for ${node.class_type}`);
    return null;
  }

  const inputDefinitions = definition.inputs.filter(
    (x) => x.type !== InputTypes.IGNORED
  );

  if (inputDefinitions.length === 0) {
    return null;
  }

  const inputs = inputDefinitions.map((input) => {
    return makeInputEditor(nodeId, node, input);
  });

  return {
    nodeId,
    definition,
    node,
    inputs,
  };
}

function makeEditors(
  workflow: WorkflowDocument,
  definitions: NodeDefinitionMap
): WorkflowEditorNode[] {
  const nodeIds = Object.keys(workflow);

  const editors = nodeIds.map((nodeId: string) =>
    makeNodeEditor(workflow, definitions, nodeId)
  );

  return editors.filter(Boolean) as WorkflowEditorNode[];
}

export function useWorkflowEditor() {
  const definitions = useAlterateStore((store) => store.backend.definitionns);

  const form = useForm();
  const sendPrompt = useAlterateStore((store) => store.sendPrompt);

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
