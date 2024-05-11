import { ComfyUITarget } from "./connection";
import { HistoryResult } from "./history";
import {
  ImageReference,
  ImageReferenceViewOptions,
  UploadImageRequest,
  UploadImageResult,
  UploadMaskRequest,
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

export function makeImageUrl(
  target: ComfyUITarget,
  image: ImageReference,
  options: ImageReferenceViewOptions
) {
  const search = new URLSearchParams();

  search.append("filename", image.filename);
  search.append("subfolder", image.subfolder);
  search.append("type", image.type);

  if (options.preview) {
    search.append("preview", "jpeg");
  }

  if (options.random) {
    search.append("random", options.random.toString());
  }

  if (options.channel) {
    search.append("channel", options.channel);
  }

  const searchString = search.toString();

  const url = getComfyUiHttpUrl(target, `view?${searchString}`);

  return url;
}

export async function fetchImage(
  target: ComfyUITarget,
  image: ImageReference,
  options: ImageReferenceViewOptions
) {
  const url = makeImageUrl(target, image, options);

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

export async function uploadMask(
  target: ComfyUITarget,
  request: UploadMaskRequest
): Promise<UploadImageResult> {
  const url = getComfyUiHttpUrl(target, "upload/mask");

  const filename = "clipspace-mask-" + performance.now() + ".png";

  const formData = new FormData();
  formData.append("image", request.mask, filename);
  formData.append("original_ref", JSON.stringify(request.originalRef));
  formData.append("type", "input");
  formData.append("subfolder", "clipspace");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const root = await res.json();
  console.log("Mask upload result", root);
  return root as UploadImageResult;
}

export async function interuptPrompt(target: ComfyUITarget) {
  const url = getComfyUiHttpUrl(target, "interrupt");

  const res = await fetch(url, {
    method: "POST",
  });

  console.log("Interrupted prompt", res.status);
}
