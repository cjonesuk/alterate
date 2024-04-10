import { ImmerStateCreator, AlterateState, WorkspacePart } from "./types";
import { makeEditors } from "@/lib/editor-mapping";

import original_workflow_data from "../../assets/workflow_api.json";
import { WorkflowDocument } from "../comfyui/workflow";

const defaultWorkspaceState = {
  definition: null,
  editors: null,
};

export const createWorkspacePart: ImmerStateCreator<
  AlterateState,
  WorkspacePart
> = (set, get) => ({
  workspace: defaultWorkspaceState,

  async loadDefaultWorkspace() {
    const document = JSON.parse(
      JSON.stringify(original_workflow_data)
    ) as WorkflowDocument;

    await get().loadWorkspace({
      workflow: document,
    });
  },

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
        nodeDefinitions
      );
    });
  },
});
