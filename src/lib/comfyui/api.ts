import { ComfyUITarget } from "./connection";
import { HistoryResult } from "./history";
import {
  ImageReference,
  UploadImageRequest,
  UploadImageResult,
} from "./images";
import { ObjectInfoRoot } from "./node-definitions";
import { WorkflowDocument } from "./workflow";

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

  return root;
}

export async function fetchPromptResult(
  target: ComfyUITarget,
  promptId: string
): Promise<HistoryResult> {
  const url = getComfyUiHttpUrl(target, `history/${promptId}`);

  const res = await fetch(url);
  const root = await res.json();

  return root;
}

export interface PromptRequest {
  client_id: string;
  prompt: WorkflowDocument;
}

export async function postPrompt(
  target: ComfyUITarget,
  request: PromptRequest
): Promise<string> {
  const url = getComfyUiHttpUrl(target, "prompt");

  const payload = JSON.stringify(request);

  const res = await fetch(url, {
    method: "POST",
    body: payload,
  });

  const resp = await res.json();

  return resp.prompt_id;
}

export async function fetchImage(target: ComfyUITarget, image: ImageReference) {
  const search = new URLSearchParams();

  search.append("filename", image.filename);
  search.append("subfolder", image.subfolder);
  search.append("type", image.type);

  const searchString = search.toString();

  const url = getComfyUiHttpUrl(target, `view?${searchString}`);

  const res = await fetch(url, {
    method: "GET",
  });

  const imageData = await res.arrayBuffer();

  return imageData;
}

export async function uploadImage(
  target: ComfyUITarget,
  request: UploadImageRequest
): Promise<UploadImageResult> {
  const url = getComfyUiHttpUrl(target, "upload/image");

  const formData = new FormData();
  formData.append("image", request.image, request.filename);
  formData.append("overwrite", request.overwrite ? "true" : "false");
  formData.append("type", request.type);
  formData.append("subfolder", request.subfolder);
  formData.append("filename", request.filename);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const root = await res.json();

  return root as UploadImageResult;
}
