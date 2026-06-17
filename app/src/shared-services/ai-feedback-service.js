const FEEDBACK_ENDPOINT = "http://localhost:3000/feedback";

/**
 * Fetches AI feedback for a given dialogue text.
 * @param {string} dialogueText - The dialogue text to fetch feedback for.
 * @returns {Promise<{ ok: boolean, feedback: string|null }>} - The feedback.
 */
export async function fetchAiFeedback(dialogueText) {
  try {
    const response = await fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dialogue: dialogueText }),
    });
    if (!response.ok) return { ok: false, feedback: null };
    const data = await response.json();
    if (!data || !data.feedback) return { ok: false, feedback: null };
    return { ok: true, feedback: data.feedback };
  } catch {
    return { ok: false, feedback: null };
  }
}
