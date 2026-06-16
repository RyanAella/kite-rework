const SETTINGS_SESSION_KEY = "settings";

export const DEFAULT_APP_SETTINGS = {
  voiceOutput: false,
  soundsActive: true,
  soundVolume: 100,
  fontSize: 50,
};

/**
 * Creates Settings Entry, if it does not exist already
 */
export function ensureSettingsDefaults() {
  if (sessionStorage.getItem(SETTINGS_SESSION_KEY) != null) return;
  sessionStorage.setItem(
    SETTINGS_SESSION_KEY,
    JSON.stringify(DEFAULT_APP_SETTINGS),
  );
}

/**
 * Loads the app settings from the session storage
 * @returns the value of the settings entry out of the storage
 */
export function loadAppSettings() {
  const raw = sessionStorage.getItem(SETTINGS_SESSION_KEY);
  if (raw == null) return { ...DEFAULT_APP_SETTINGS };
  try {
    return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_APP_SETTINGS };
  }
}

/**
 * Saves the app settings to the session storage
 * @param {*} settings The new settings object that will be saved
 */
export function saveAppSettings(settings) {
  sessionStorage.setItem(SETTINGS_SESSION_KEY, JSON.stringify(settings));
}
