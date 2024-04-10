const machine_name = "localhost";
const port = "8188";

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

export async function fetchHistory() {
  const url = getHttpUrl("history");

  const res = await fetch(url);
  return res.json();
}
