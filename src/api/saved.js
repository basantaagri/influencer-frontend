import { apiFetch } from "./client";

// ----------------------------------
// Get saved influencers
// ----------------------------------
export const fetchSaved = async () => {
  return apiFetch("/saved");
};

// ----------------------------------
// Save influencer
// ----------------------------------
export const saveInfluencer = async (id) => {
  return apiFetch(`/saved/${id}`, {
    method: "POST",
  });
};

// ----------------------------------
// Remove saved influencer
// ----------------------------------
export const removeSaved = async (id) => {
  return apiFetch(`/saved/${id}`, {
    method: "DELETE",
  });
};
