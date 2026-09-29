// Talks to the Kite2 server (kite2.site) like the Unity original:
// 1. POST /api/auth/session with an HMAC signature -> session token
// 2. POST /ai with the Bearer token -> AI completion
// Server responses use { resultCode, resultText, completion };
// resultCode 3 means success (ResultCode.SuccessfullyGotCompletion).

const BASE_LINK = "https://kite2.site/";
const AUTH_LINK = BASE_LINK + "api/auth/session";
const COMPLETION_LINK = BASE_LINK + "ai";
const RESULT_SUCCESS = 3;
const REQUEST_TIMEOUT_MS = 90000; // AI feedback can take 30-60 seconds

/**
 * Calculates the HMAC-SHA256 signature for the auth request.
 * Same algorithm as the server (HmacRequestValidator.java):
 * hex-encoded HmacSHA256 over (timestamp + body), using the shared passphrase.
 * @param {string} timestamp Unix timestamp in seconds as a string
 * @param {string} body the request body ("" for the auth request)
 * @returns {Promise<string>} the signature as lowercase hex
 */
async function calculateSignature(timestamp, body) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(window.KITE_CONFIG?.passphrase ?? ""),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp + body));
  return Array.from(new Uint8Array(signature))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
}

/**
 * Requests a session token from the server. The token is valid for 10 minutes.
 * @returns {Promise<string|null>} the token or null on failure
 */
async function requestSessionToken() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const body = ""; // auth request has no body
  const signature = await calculateSignature(timestamp, body);

  const response = await fetch(AUTH_LINK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Kite-Timestamp": timestamp,
      "X-Kite-Signature": signature,
    },
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data?.resultCode !== RESULT_SUCCESS) return null;
  return data.completion || null;
}

/**
 * Fetches AI feedback for a fully assembled prompt from the Kite2 server.
 * @param {string} prompt the complete prompt (from prompt-service)
 * @returns {Promise<{ ok: boolean, feedback: string|null }>}
 */
export async function fetchAiFeedback(prompt) {
  try {
    const token = await requestSessionToken();
    if (!token) return { ok: false, feedback: null };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(COMPLETION_LINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) return { ok: false, feedback: null };
    const data = await response.json();
    if (data?.resultCode !== RESULT_SUCCESS || !data.completion) {
      return { ok: false, feedback: null };
    }
    return { ok: true, feedback: data.completion };
  } catch {
    return { ok: false, feedback: null };
  }
}