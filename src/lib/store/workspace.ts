import { ImmerStateCreator, AlterateState, WorkspacePart } from "./types";

const defaultWorkspaceState = {
  workflow: null,
  editors: null,
};

export const createWorkspacePart: ImmerStateCreator<
  AlterateState,
  WorkspacePart
> = (set, get) => ({
  workspace: defaultWorkspaceState,

  async loadWorkspace(definition) {
    set((state) => {
      state.workspace = definition;
    });
  },
});
