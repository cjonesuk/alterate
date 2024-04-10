export interface ProgressMessage {
  type: "progress";
  data: {
    value: number;
    max: number;
    prompt_id: string;
  };
}

export interface StatusMessage {
  type: "status";
  data: {
    status: {
      exec_info: {
        queue_remaining: number;
      };
    };
  };
}

export interface ExecutionStartedMessage {
  type: "execution_started";
  data: {
    prompt_id: string;
  };
}

export interface ExecutingMessage {
  type: "executing";
  data: {
    node: string;
    prompt_id: string;
  };
}

export interface ExecutedMessage {
  type: "executed";
  data: {
    node: string | null;
    prompt_id: string;
  };
}

export interface ExecutionCachedMessage {
  type: "execution_cached";
  data: {
    nodes: string[];
    prompt_id: string;
  };
}

export type WebsocketMessage =
  | ProgressMessage
  | StatusMessage
  | ExecutionStartedMessage
  | ExecutingMessage
  | ExecutedMessage
  | ExecutionCachedMessage;
