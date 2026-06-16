/* Tracks whether a novel is currently in progress. Active while in
   novel-scene or after navigating to Settings/Legal via the in-novel
   header; cleared on finish, leave, pause, or when returning to the
   novel-selector hub. */
const NOVEL_SESSION_KEY = "novelSessionActive";

/**
 * Marks a novel as started
 */
export function markNovelSessionStarted() {
  try { sessionStorage.setItem(NOVEL_SESSION_KEY, "1"); } catch { /* sessionStorage unavailable */ }
}

/**
 * Marks a novel as finished
 */
export function markNovelSessionEnded() {
  try { sessionStorage.removeItem(NOVEL_SESSION_KEY); } catch { /* sessionStorage unavailable */ }
}

/**
 * Get the status of the novel
 * @returns true when a session is active, false otherwise
 */
export function isNovelSessionActive() {
  try { return sessionStorage.getItem(NOVEL_SESSION_KEY) === "1"; } catch { return false; }
}
