import { apiFetch } from "./client";

export const getHealth = async () => {
  return apiFetch("/health");
};
