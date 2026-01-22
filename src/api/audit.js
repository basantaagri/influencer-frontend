import { apiFetch } from "./client";

export const fetchAudit = async (influencerId) => {
  if (!influencerId) {
    throw new Error("Influencer ID is required");
  }

  return apiFetch(`/audit/${influencerId}`);
};
