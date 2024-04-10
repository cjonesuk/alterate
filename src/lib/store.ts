import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AlterateStore } from "./store/types";
import { createBackendPart } from "./store/backend";
import { createWorkspacePart } from "./store/workspace";

const alterateStore = create<AlterateStore>()(
  immer((set, get, store) => {
    const backendPart = createBackendPart(set, get, store);
    const workspacePart = createWorkspacePart(set, get, store);

    return {
      ...backendPart,
      ...workspacePart,
    };
  })
);

const useAlterateStore = alterateStore;

export { alterateStore, useAlterateStore };
