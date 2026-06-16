import { readJson, writeJson } from "./store-service.js";

/**
 * Gets data from the Archive Storage.
 * @param {*} calledFromArchive Whether this mehtod is called from the ArchiveScene
 * @returns All data from the Archive Storage as an Object
 */
export function getArchiveData(calledFromArchive) {

  const rawData = Object.values(readJson("archive", []));
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