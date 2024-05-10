import { StateCreator } from "zustand";
import { NodeDefinitionMap } from "../definition-mapping";
import { WorkflowDocument } from "../comfyui/workflow";
import { WorkflowEditorNode } from "../editor-mapping";
import { HistoryPromptResult } from "../comfyui/history";
import { ImageReference } from "../comfyui/images";

export type ImmerStateCreator<T, TPart> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  TPart
>;

export type ConnectionDetails = {
  id: string;
  name: string;
  description: string;
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
  connect: (details: ConnectionDetails) => void;
  updateLiveImage(imageBlob: Blob): void;
  updateProgress(promptId: string, step: number, steps: number): void;
  updateQueueLength(input: number): void;
  sendPrompt(workflow: WorkflowDocument): Promise<string | null>;
  refreshDefinitions(): Promise<void>;
  promptCompleted(promptId: string): Promise<void>;
  acceptImage(reference: ImageReference, image: Blob): Promise<void>;
  uploadImage(file: File): Promise<ImageReference>;
  uploadMask(mask: Blob, originalRef: ImageReference): Promise<ImageReference>;
  interuptPrompt(): Promise<void>;
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
  outputImages: ImageReference[];
};

type WorkspaceActions = {
  loadWorkspace(definition: WorkspaceDefinition): Promise<void>;
  startJob(workflow: WorkflowDocument): Promise<void>;
  notifyPromptCompleted(result: HistoryPromptResult): void;
};

export type WorkspacePart = WorkspaceActions & {
  workspace: WorkspaceState;
};

export type AlterateState = BackendPart & WorkspacePart;

export type AlterateStore = AlterateState;
