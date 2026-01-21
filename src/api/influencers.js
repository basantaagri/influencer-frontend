// frontend/src/api/influencers.js
// Influencer API — FINAL (apiFetch based)

import { apiFetch } from "./client";

// ----------------------------------
// Fetch all influencers
// ----------------------------------
export const fetchInfluencers = async () => {
  // NOTE: trailing slash is important (FastAPI redirect-safe)
  return apiFetch("/influencers/");
};

// ----------------------------------
// Fetch single influencer by ID
// ----------------------------------
export const fetchInfluencerById = async (id) => {
  if (!id) {
    throw new Error("Influencer ID is required");
  }

  return apiFetch(`/influencers/${id}`);
};
