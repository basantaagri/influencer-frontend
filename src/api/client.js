// frontend/src/api/client.js
// API client — FINAL (LOCAL + PROD SAFE)

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://127.0.0.1:8000";

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
      const text = await response.text();
      throw new Error(text || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
};
