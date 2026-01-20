const API_BASE = "http://127.0.0.1:8002";

// ----------------------------------
// Get saved influencers
// ----------------------------------
export async function fetchSaved() {
  const res = await fetch(`${API_BASE}/saved`);
  if (!res.ok) throw new Error("Failed to fetch saved");
  return res.json();
}

// ----------------------------------
// Save influencer
// ----------------------------------
export async function saveInfluencer(id) {
  const res = await fetch(`${API_BASE}/saved/${id}`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to save influencer");
  return res.json();
}

// ----------------------------------
// Remove saved influencer
// ----------------------------------
export async function removeSaved(id) {
  const res = await fetch(`${API_BASE}/saved/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove saved influencer");
  return res.json();
}
