// frontend/src/api/client.js
// API client – v1.0-beta (LOCKED, COMPATIBLE)

// ✅ PRODUCTION BACKEND (Render)
const API_BASE = "https://influencer-backend.onrender.com";

/**
 * Core fetch wrapper (USED ACROSS APP)
 */
export const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};

/**
 * Influencers
 */
export const fetchInfluencers = () => {
  return apiFetch("/influencers");
};

export const fetchInfluencerById = (id) => {
  return apiFetch(`/influencers/${id}`);
};

/**
 * Collaborations
 */
export const requestCollaboration = (payload) => {
  return apiFetch("/collaborations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const fetchCollaborations = () => {
  return apiFetch("/collaborations");
};
