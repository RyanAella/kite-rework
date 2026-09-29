import { readJson, writeJson } from "./store-service.js";

/**
 * Gets data from the Archive Storage.
 * @param {*} calledFromArchive Whether this method is called from the ArchiveScene
 * @returns All data from the Archive Storage as an Object
 */
export function getArchiveData(calledFromArchive) {

  const rawData = Object.values(readJson("archive", []))
      .sort((a, b) => {
        const timeA = a.date ? new Date(a.date).getTime() : 0;
        const timeB = b.date ? new Date(b.date).getTime() : 0;
        return timeB - timeA; // newest first
      });
  let data = {};

  rawData.forEach(element => {
    if(element.completed == false) {
      return;
    }
    const novelName = element.novelName;
    if(data[novelName] == null) {
      data[novelName] = [];
    }
    delete element["novelName"];
    data[novelName].push(element);
    
    if (calledFromArchive) {
      let infoText = document.querySelector("#empty-info-text");
      infoText.classList.add("hidden");
    }
    
  });

  return data;
}