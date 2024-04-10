import {
  AnyInputType,
  InputTypes,
  NodeDefinition,
  NodeDefinitionMap,
} from "./definition-mapping";
import { WorkflowDocument, WorkflowNode } from "./comfyui/workflow";

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

export function makeEditors(
  workflow: WorkflowDocument,
  definitions: NodeDefinitionMap
): WorkflowEditorNode[] {
  const nodeIds = Object.keys(workflow);

  const editors = nodeIds.map((nodeId: string) =>
    makeNodeEditor(workflow, definitions, nodeId)
  );

  return editors.filter(Boolean) as WorkflowEditorNode[];
}
