import { readJson, writeJson } from "./store-service.js";

const storeKey = "archive"

function setup() {
  if(readJson(storeKey) == undefined) {
    console.log("progress-tracking-service::setup");
    writeJson(storeKey, {});
  }
}

export function newNovelInfo(novelName) {
  setup();
  console.log("progress-tracking-service::newNovelInfo");
  let archive = readJson(storeKey);
  let storageInstanceKey = crypto.randomUUID();
  console.log(archive);
  console.log(storageInstanceKey);
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

export function addDialogChoice(UUID, choice) {
  console.log("progress-tracking-service::addDialogeChoice");
  console.log(`storeKey: ${storeKey} | UUID: ${UUID}`);
  let archive = readJson(storeKey);
  archive[UUID].dialog.push(choice);
  writeJson(storeKey, archive);
}

export function getNovelInfo(UUID) {
  return readJson(storeKey)[UUID];
}

export function setCompletedFlag(UUID, lastEventId = null, isPremature = false) {
  console.log("progress-tracking-service::setCompletedFlag");
  let archive = readJson(storeKey);
  archive[UUID].completed = true;

  // Speichern der exakten Event-ID und den Abbruch-Status
  archive[UUID].lastEventId = lastEventId;
  archive[UUID].isPremature = isPremature;

  writeJson(storeKey, archive);
}