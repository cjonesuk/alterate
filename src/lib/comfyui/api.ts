import { ComfyUITarget } from "./connection";

export function getComfyUiHttpUrl(
  { machineName, port }: ComfyUITarget,
  endpoint?: string
) {
  if (endpoint) {
    return `http://${machineName}:${port}/${endpoint}`;
  }

  return `http://${machineName}:${port}`;
}

export async function fetchObjectInfo(target: ComfyUITarget) {
  const nodes_url = getComfyUiHttpUrl(target, "object_info");

  const res = await fetch(nodes_url);
  return res.json();
}

export async function fetchHistory(target: ComfyUITarget) {
  const url = getComfyUiHttpUrl(target, "history");

  const res = await fetch(url);
  return res.json();
}
