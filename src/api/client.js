const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}
