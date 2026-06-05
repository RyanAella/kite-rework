/* Tracks whether a novel is currently in progress. Active while in
   novel-scene or after navigating to Settings/Legal via the in-novel
   header; cleared on finish, leave, pause, or when returning to the
   novel-selector hub. */
const NOVEL_SESSION_KEY = "novelSessionActive";

export function markNovelSessionStarted() {
  try { sessionStorage.setItem(NOVEL_SESSION_KEY, "1"); } catch { /* sessionStorage unavailable */ }
}

export function markNovelSessionEnded() {
  try { sessionStorage.removeItem(NOVEL_SESSION_KEY); } catch { /* sessionStorage unavailable */ }
}

export function isNovelSessionActive() {
  try { return sessionStorage.getItem(NOVEL_SESSION_KEY) === "1"; } catch { return false; }
}
