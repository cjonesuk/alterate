import { ImmerStateCreator, AlterateState, WorkspacePart } from "./types";
import { makeEditors } from "@/lib/editor-mapping";

const defaultWorkspaceState = {
  definition: null,
  editors: null,
  promptId: null,
  outputImages: [],
};

export const createWorkspacePart: ImmerStateCreator<
  AlterateState,
  WorkspacePart
> = (set, get) => ({
  workspace: defaultWorkspaceState,

  async loadWorkspace(definition) {
    const nodeDefinitions = get().backend.definitions;

    if (!nodeDefinitions) {
      console.error("No definition loaded from backend");
      return;
    }

    set((draft) => {
      draft.workspace.definition = definition;
      draft.workspace.editors = makeEditors(
        definition.workflow,
        nodeDefinitions,
      );
    });
  },

  async startJob(workflow) {
    console.log("Starting job");

    const promptId = await get().sendPrompt(workflow);

    set((draft) => {
      draft.workspace.promptId = promptId;
    });
  },

  notifyPromptCompleted(result) {
    set((draft) => {
      const promptId = draft.workspace.promptId;

      const completedPromptId = result.prompt[1];

      if (promptId !== completedPromptId) {
        console.error("Prompt ID does not match, ignoring...");
        return;
      }

      console.log("Prompt completed", promptId, result);

      draft.workspace.promptId = null;

      const images = Object.entries(result.outputs).flatMap((output) => {
        const nodeOutput = output[1];

        const images = nodeOutput.images?.map((image) => image) || [];
        return images;
      });

      draft.workspace.outputImages = images;
    });
  },
});
