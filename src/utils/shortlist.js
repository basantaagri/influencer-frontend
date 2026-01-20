import {
  fetchSaved,
  saveInfluencer,
  removeSaved,
} from "../api/saved";

// -------------------------------------------------
// Get shortlisted influencer IDs (API — SAFE)
// -------------------------------------------------
export async function getShortlist() {
  try {
    const saved = await fetchSaved();
    return Array.isArray(saved)
      ? saved.map((s) => s.influencer_id)
      : [];
  } catch (err) {
    console.error("getShortlist failed", err);
    return [];
  }
}

// -------------------------------------------------
// Check if influencer is shortlisted (API — SAFE)
// -------------------------------------------------
export async function isShortlisted(id) {
  try {
    const list = await getShortlist();
    return list.includes(id);
  } catch (err) {
    console.error("isShortlisted failed", err);
    return false;
  }
}

// -------------------------------------------------
// Toggle shortlist state (API — SAFE)
// -------------------------------------------------
export async function toggleShortlist(id) {
  try {
    const list = await getShortlist();

    if (list.includes(id)) {
      await removeSaved(id);
      return list.filter((x) => x !== id);
    } else {
      await saveInfluencer(id);
      return [...list, id];
    }
  } catch (err) {
    console.error("toggleShortlist failed", err);
    return [];
  }
}
