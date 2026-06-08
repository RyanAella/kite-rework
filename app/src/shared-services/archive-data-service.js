import { readJson, writeJson } from "./store-service.js";

export function getArchiveData(calledFromArchive) {

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
        
        if (calledFromArchive) {
            let infoText = document.querySelector("#empty-info-text");
            console.log("Text: " + infoText);
            infoText.classList.add("hidden");
        }
        
    });

    console.log(data);

    return data;
}