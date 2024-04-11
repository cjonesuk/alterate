import { ObjectInfoRoot } from "./node-definitions";

export interface ImageOutput {
  filename: string;
  subfolder: string;
  type: "output" | "temp";
}

export interface NodeOutput {
  images?: ImageOutput[];
}

export interface HistoryPromptOutputs {
  [key: string]: NodeOutput;
}

export interface HistoryPromptStatus {
  status_str: string;
  completed: boolean;
  messages:
    | [
        "executation_start",
        {
          prompt_id: string;
        },
      ]
    | [
        "execution_cached",
        {
          prompt_id: string;
          nodes: string[];
        },
      ];
}

export interface HistoryPromptResult {
  // run number, prompt id, executed prompt
  prompt: [number, string, ObjectInfoRoot];
  outputs: HistoryPromptOutputs;
}

export interface HistoryResult {
  [promptId: string]: HistoryPromptResult;
}
