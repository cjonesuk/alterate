import original_workflow_data from "./assets/workflow_api.json";
import {
  AnyInputType,
  InputTypes,
  NodeDefinition,
  NodeDefinitionMap,
  useNodeDefinitions,
} from "./comfyui/useObjectInfo";
import { WorkflowDocument, WorkflowNode } from "./comfyui/types/workflow";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { queueWorkflow } from "./comfyui/api";

//const clientId = str(uuidv4());
// function useComfyUIWebsocket() {
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   useEffect(() => {
//     const url = getWsUrl(clientId);
//     const ws = new WebSocket(url);
//     ws.onopen = () => {
//       console.log("Connected to ComfyUI websocket");
//     };
//     ws.onclose = () => {
//       console.log("Disconnected from ComfyUI websocket");
//     };
//     setSocket(ws);
//     return () => {
//       ws.close();
//     };
//   }, []);
//   return socket;
// }
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
  const { definitions, error, isLoading } = useNodeDefinitions();
  const form = useForm();

  const workflow = useMemo(
    () =>
      JSON.parse(JSON.stringify(original_workflow_data)) as WorkflowDocument,
    []
  );

  const editors = useMemo(() => {
    if (isLoading || !definitions || error) {
      return null;
    }

    return makeEditors(workflow, definitions);
  }, [isLoading, error, definitions, workflow]);

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

    const id = await queueWorkflow(workflowCopy);
    console.log("Job Queued:", id);
  });

  return { isLoading, error, definitions, editors, form, submit };
}