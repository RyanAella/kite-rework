const SETTINGS_STORAGE_KEY = "settings";

export const DEFAULT_APP_SETTINGS = {
  voiceOutput: false,
  soundsActive: true,
  soundVolume: 100,
  fontSize: 50,
};
/**
 * Ensures the settings defaults are set in local storage
 * @returns {void}
 */
export function ensureSettingsDefaults() {
  if (localStorage.getItem(SETTINGS_STORAGE_KEY) != null) return;
  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(DEFAULT_APP_SETTINGS),
  );
}

/**
 * Loads the app settings from local storage
 * @returns {Object} The app settings
 */
export function loadAppSettings() {
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (raw == null) return { ...DEFAULT_APP_SETTINGS };
  try {
    return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_APP_SETTINGS };
  }
}

/**
 * Saves the app settings to local storage
 * @param {Object} settings - The app settings
 * @returns {void}
 */
export function saveAppSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
