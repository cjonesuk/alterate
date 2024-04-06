import { v4 as uuidv4 } from "uuid";

const machine_name = "localhost";
const port = "8188";

const clientId = uuidv4();

export function getWsUrl() {
  return `ws://${machine_name}:${port}/ws?clientId=${clientId}`;
}

export function getHttpUrl(endpoint?: string) {
  if (endpoint) {
    return `http://${machine_name}:${port}/${endpoint}`;
  }

  return `http://${machine_name}:${port}`;
}

export async function fetchObjectInfo() {
  const nodes_url = getHttpUrl("object_info");

  const res = await fetch(nodes_url);
  return res.json();
}

export async function queueWorkflow(workflow: unknown) {
  const url = getHttpUrl("prompt");
  const payload = JSON.stringify({ prompt: workflow, client_id: clientId });

  const res = await fetch(url, {
    method: "POST",
    body: payload,
  });

  const resp = await res.json();

  return resp.prompt_id;
}
