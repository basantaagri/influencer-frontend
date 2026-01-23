// frontend/src/api/influencers.js
// Influencer API — FINAL (PROD SAFE, BACKWARD COMPATIBLE, SWAGGER ALIGNED)

import { apiFetch } from "./client";

/**
 * Fetch influencers
 *
 * ✅ Supports BOTH call styles:
 *    fetchInfluencers({ page, per_page })
 *    fetchInfluencers(page, perPage)
 *
 * ✅ Backend route:
 *    GET /influencers/influencers
 *
 * ✅ Always returns ARRAY (UI-safe)
 */
export const fetchInfluencers = async (arg1 = 1, arg2 = 10) => {
  let page = 1;
  let per_page = 10;

  // 🔒 NEW STYLE (object-based)
  if (typeof arg1 === "object" && arg1 !== null) {
    page = arg1.page ?? 1;
    per_page = arg1.per_page ?? 10;
  }
  // 🔒 OLD STYLE (positional args)
  else {
    page = arg1 ?? 1;
    per_page = arg2 ?? 10;
  }

  const res = await apiFetch(
    `/influencers/influencers?page=${page}&per_page=${per_page}`
  );

  // ✅ HARD SAFETY — frontend ALWAYS gets array
  if (!Array.isArray(res)) {
    console.error("Influencers API returned non-array:", res);
    return [];
  }

  return res;
};

// ----------------------------------
// Fetch single influencer by ID
// ----------------------------------
export const fetchInfluencerById = async (id) => {
  if (!id) {
    throw new Error("Influencer ID is required");
  }

  // Backend route:
  // GET /influencers/influencers/{influencer_id}
  return apiFetch(`/influencers/influencers/${id}`);
};

// ----------------------------------
// Reveal influencer (JWT PROTECTED)
// ----------------------------------
export const revealInfluencer = async (id) => {
  if (!id) {
    throw new Error("Influencer ID is required");
  }

  // Backend route:
  // POST /reveal/{influencer_id}
  return apiFetch(`/reveal/${id}`, {
    method: "POST",
  });
};
