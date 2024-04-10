import { StateCreator } from "zustand";
import { NodeDefinitionMap } from "../definition-mapping";

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
  definitionns: NodeDefinitionMap | null;
};

type BackendActions = {
  connectToDefault: () => void;
  connect: (details: ConnectionDetails) => void;
  updateLiveImage(imageBlob: Blob): void;
  updateProgress(promptId: string, step: number, steps: number): void;
  updateQueueLength(input: number): void;
  sendPrompt(workflow: unknown): Promise<string>;
  refreshDefinitions(): Promise<void>;
};

export type BackendPart = BackendActions & {
  backend: BackendState;
};

export type State = BackendPart;

export type Actions = BackendActions;

export type Store = State & Actions;
