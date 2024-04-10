import { ComfyUITarget } from "./connection";
import { ObjectInfoRoot } from "./node-definitions";

export function getComfyUiHttpUrl(
  { machineName, port }: ComfyUITarget,
  endpoint?: string
) {
  if (endpoint) {
    return `http://${machineName}:${port}/${endpoint}`;
  }

  return `http://${machineName}:${port}`;
}

export async function fetchObjectInfo(
  target: ComfyUITarget
): Promise<ObjectInfoRoot> {
  const nodes_url = getComfyUiHttpUrl(target, "object_info");

  const res = await fetch(nodes_url);
  const root = await res.json();

  return root as ObjectInfoRoot;
}

export async function fetchPromptResult(
  target: ComfyUITarget,
  promptId: string
) {
  const url = getComfyUiHttpUrl(target, `history/${promptId}`);

  const res = await fetch(url);
  return await res.json();
}
