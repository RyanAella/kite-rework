import { loadAppSettings } from "./app-settings-session-service.js";

/**
 * Convert slider value (0–100) to cqw font size (matches settings example text formula)
 * @param {*} fontSize 
 * @returns the size in cqw
 */
export function fontSizeToCqw(fontSize) {
  return 3 + Number(fontSize) / 100;
}

/**
 * Apply persisted user font size as CSS variable on document root
 */
export function applyUserFontSize() {
  const { fontSize } = loadAppSettings();
  document.documentElement.style.setProperty(
    "--user-font-size",
    `${fontSizeToCqw(fontSize)}cqw`,
  );
}
