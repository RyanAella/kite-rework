import { readJson, writeJson } from "./store-service.js";

export function getArchiveData(calledFromArchive) {
    const storageJson = readJson("archive");
    if(storageJson == undefined && calledFromArchive) {
        addEmptyinfoText();
        return [];
    }

    const rawData = Object.values(readJson("archive", []));
    let data = {};
    console.log(rawData);
    
    rawData.forEach(element => {
        if(element.completed == false) {
        return;
        }
        const novelName = element.novelName;
        console.log(element);
        if(data[novelName] == null) {
        data[novelName] = [];
        }
        delete element["novelName"];
        data[novelName].push(element);
    });

    console.log(data);

    return data;
}

function addEmptyinfoText() {
    const novelContainer = document.querySelector("#novel-container");
    let emptyText = document.createElement("p");
    emptyText.classList = "text-[3.6cqw] font-medium tracking-tight text-[#284673]"
    emptyText.innerHTML = "Spiele eine Novel, um hier deinen ersten Eintrag zu sehen."
    novelContainer.appendChild(emptyText);
}