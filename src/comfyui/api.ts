const machine_name = "localhost"
const port = "8188"
 
export function getWsUrl(clientId: string) { 
  return `ws://${machine_name}:${port}/ws?clientId=${clientId}`
}

export function getHttpUrl(endpoint?: string) {
  if(endpoint) {
    return `http://${machine_name}:${port}/${endpoint}`
  }

  return `http://${machine_name}:${port}`
}

export async function fetchObjectInfo() {
    const nodes_url = getHttpUrl('object_info');

    const res = await fetch(nodes_url);
    return res.json();
  }

export async function queueWorkflow(workflow: unknown) {
  const url = getHttpUrl('prompt')
  const payload = JSON.stringify({prompt: workflow});

  const res = await fetch(url, {
    method: 'POST',
   body: payload,
  })

  const resp = await res.json()

  return resp.prompt_id;
}