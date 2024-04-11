import { StateCreator } from "zustand";
import { NodeDefinitionMap } from "../definition-mapping";
import { WorkflowDocument } from "../comfyui/workflow";
import { WorkflowEditorNode } from "../editor-mapping";
import { HistoryPromptResult } from "../comfyui/history";

export type ImmerStateCreator<T, TPart> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  TPart
>;

export type ConnectionDetails = {
  machineName: string;
  port: number;
  clientId: string;
};

export interface ProgressSummary {
  promptId: string | null;
  step: number;
  steps: number;
  ratio: number;
  percentage: number;
}

export interface ExecutionSummary {
  promptId: string;
  nodeId: string;
}

export interface QueueSummary {
  length: number;
}

export type BackendState = {
  connection: ConnectionDetails | null;
  websocket: WebSocket | null;
  queue: QueueSummary;
  progress: ProgressSummary;
  execution: ExecutionSummary;
  liveImageUrl: string | null;
  definitions: NodeDefinitionMap | null;
};

type BackendActions = {
  connectToDefault: () => void;
  connect: (details: ConnectionDetails) => void;
  updateLiveImage(imageBlob: Blob): void;
  updateProgress(promptId: string, step: number, steps: number): void;
  updateQueueLength(input: number): void;
  sendPrompt(workflow: unknown): Promise<string>;
  refreshDefinitions(): Promise<void>;
  promptCompleted(promptId: string): Promise<void>;
};

export type BackendPart = BackendActions & {
  backend: BackendState;
};

export type WorkspaceDefinition = {
  workflow: WorkflowDocument;
};

export type WorkspaceState = {
  definition: WorkspaceDefinition | null;
  editors: WorkflowEditorNode[] | null;
  promptId: string | null;
  outputImages: {
    filename: string;
    subfolder: string;
    type: "output" | "temp";
  }[];
};

type WorkspaceActions = {
  loadDefaultWorkspace(): Promise<void>;
  loadWorkspace(definition: WorkspaceDefinition): Promise<void>;
  startJob(workflow: WorkflowDocument): Promise<void>;
  notifyPromptCompleted(result: HistoryPromptResult): void;
};

export type WorkspacePart = WorkspaceActions & {
  workspace: WorkspaceState;
};

export type AlterateState = BackendPart & WorkspacePart;

export type AlterateStore = AlterateState;
