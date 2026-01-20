export async function getHealth() {
  const response = await fetch("http://127.0.0.1:8002/health");
  return response.json();
}
