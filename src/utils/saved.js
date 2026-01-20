const KEY = "saved_influencers";

export function getSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isSaved(id) {
  return getSaved().some((inf) => inf.id === id);
}

export function toggleSave(influencer) {
  const saved = getSaved();

  const exists = saved.find((i) => i.id === influencer.id);

  let updated;
  if (exists) {
    updated = saved.filter((i) => i.id !== influencer.id);
  } else {
    updated = [...saved, influencer];
  }

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
