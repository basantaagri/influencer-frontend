import { apiFetch } from "./client";

export const fetchCredits = async () => {
  return apiFetch("/credits");
};
