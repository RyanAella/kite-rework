import { readJson, writeJson } from "./store-service.js";

const storeKey = "archive"

/**
 * Adds a new entry in the local storage for the archive entries, if one does not exist already.
 */
function setup() {
  if(readJson(storeKey) == undefined) {
    writeJson(storeKey, {});
  }
}

/**
 * Creates a new Entry in the localStorage Archive Storage Object.
 * @param {string} novelName the name of the novel, this entry belongs to
 * @returns The ID of the new entry
 */
export function newNovelInfo(novelName) {
  setup();
  let archive = readJson(storeKey);
  let storageInstanceKey = crypto.randomUUID();
  archive[storageInstanceKey] = ({
    "novelName": novelName,
    "date": new Date(),
    "dialog": [],
    "kifeedback": null,
    "completed": false
  });
  writeJson("archive", archive);
  return storageInstanceKey;
}

/**
 * Adds a user choice to an entry in the Archive Storage Object.
 * @param {UUID} UUID The ID of the entry
 * @param {number} choice the users choice
 */
export function addDialogChoice(UUID, choice) {
  let archive = readJson(storeKey);
  archive[UUID].dialog.push(choice);
  writeJson(storeKey, archive);
}

/**
 * Truncates the dialog choices for a given UUID.
 * @param {string} UUID - The UUID of the novel.
 * @param {number} length - The length of the dialog choices to truncate.
 */
export function truncateDialogChoices(UUID, length) {
  let archive = readJson(storeKey);
  if (!archive?.[UUID] || !Array.isArray(archive[UUID].dialog)) return;
  archive[UUID].dialog.length = Math.max(0, length);
  writeJson(storeKey, archive);
}

/**
 * Saves the AI feedback text to an entry in the Archive Storage Object.
 * @param {UUID} UUID The ID of the entry
 * @param {string} feedback The AI generated feedback text
 */
export function setAiFeedback(UUID, feedback) {
  let archive = readJson(storeKey);
  if (!archive?.[UUID]) return;
  archive[UUID].kifeedback = feedback;
  writeJson(storeKey, archive);
}

/**
 * Gets an Archive Storage Entry.
 * @param {UUID} UUID The ID of the Entry
 * @returns The Object stored for the given ID
 */
export function getNovelInfo(UUID) {
  return readJson(storeKey)[UUID];
}

/**
 * Marks an Archive Storage Entry as Completed.
 * @param {UUID} UUID The ID of the Entry
 * @param {number} lastEventId The ID of the last played event
 * @param {Boolean} isPremature Whether the novel as been aborted instead of beeing completed normally
 */
export function setCompletedFlag(UUID, lastEventId = null, isPremature = false) {
  let archive = readJson(storeKey);
  archive[UUID].completed = true;

  // Speichern der exakten Event-ID und den Abbruch-Status
  archive[UUID].lastEventId = lastEventId;
  archive[UUID].isPremature = isPremature;

  writeJson(storeKey, archive);
}