const API_BASE = "http://127.0.0.1:8000";

// ----------------------------------
// Fetch all influencers
// ----------------------------------
export async function fetchInfluencers() {
  const res = await fetch(`${API_BASE}/influencers`);

  if (!res.ok) {
    throw new Error("Failed to fetch influencers");
  }

  return res.json();
}

// ----------------------------------
// Fetch single influencer by ID
// ----------------------------------
export async function fetchInfluencerById(id) {
  const res = await fetch(`${API_BASE}/influencers/${id}`);

  if (!res.ok) {
    throw new Error("Influencer not found");
  }

  return res.json();
}
