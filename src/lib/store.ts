import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Store } from "./store/types";
import { createBackendPart } from "./store/backend";

const alterateStore = create<Store>()(
  immer((set, get, store) => {
    const backendPart = createBackendPart(set, get, store);

    return {
      ...backendPart,
    };
  })
);

const useAlterateStore = alterateStore;

export { alterateStore, useAlterateStore };
