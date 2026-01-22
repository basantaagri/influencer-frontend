// frontend/src/api/influencers.js
// Influencer API — FINAL (apiFetch based)

import { apiFetch } from "./client";

// ----------------------------------
// Fetch all influencers
// (Pagination supported, backward-compatible)
// ----------------------------------
export const fetchInfluencers = async (
  page = 1,
  perPage = 10
) => {
  // If caller does not care about pagination,
  // defaults will be used and nothing breaks
  return apiFetch(
    `/influencers/?page=${page}&per_page=${perPage}`
  );
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

// ----------------------------------
// Reveal influencer (JWT PROTECTED)
// ----------------------------------
export const revealInfluencer = async (id) => {
  if (!id) {
    throw new Error("Influencer ID is required");
  }

  return apiFetch(`/reveal/${id}`, {
    method: "POST",
  });
};
