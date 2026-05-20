const SETTINGS_SESSION_KEY = "settings";

export const DEFAULT_APP_SETTINGS = {
  voiceOutput: false,
  soundsActive: true,
  soundVolume: 100,
  typeSize: 0,
};

// Ensure the settings defaults are set in the session storage
export function ensureSettingsDefaults() {
  if (sessionStorage.getItem(SETTINGS_SESSION_KEY) != null) return;
  sessionStorage.setItem(
    SETTINGS_SESSION_KEY,
    JSON.stringify(DEFAULT_APP_SETTINGS),
  );
}

// Load the app settings from the session storage
export function loadAppSettings() {
  const raw = sessionStorage.getItem(SETTINGS_SESSION_KEY);
  if (raw == null) return { ...DEFAULT_APP_SETTINGS };
  try {
    return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_APP_SETTINGS };
  }
}

// Save the app settings to the session storage
export function saveAppSettings(settings) {
  sessionStorage.setItem(SETTINGS_SESSION_KEY, JSON.stringify(settings));
}
