export async function fetchAudit(influencerId) {
  const response = await fetch(
    `http://127.0.0.1:8002/audit/${influencerId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch audit");
  }
  return response.json();
}
