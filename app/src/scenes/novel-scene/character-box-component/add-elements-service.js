import { pathFinding } from "./path-finding-service.js";

export async function addElements(CharacterBox, characterInfo) {
  console.log("addElements");
  let paths = []
  paths.push(['ImgHead', pathFinding(characterInfo, "Head")]);
  paths.push(['ImgHair', pathFinding(characterInfo, "Hair")]);
  paths.push(['ImgClothes', pathFinding(characterInfo, "Clothes")]);
  paths.push(['ImgFace', pathFinding(characterInfo, "Face", 5, false)]);
  paths.push(['ImgEyes', pathFinding(characterInfo, "Eyes", "Eyes_Open")]);
  if(characterInfo["glasses"]) paths.push(['ImgGlasses', pathFinding(characterInfo, "Glasses")]);
  if(characterInfo["headset"]) paths.push(['ImgHeadset', pathFinding(characterInfo, "Headset")]);
  
  //Hands
  const handsResponse = await fetch(pathFinding(characterInfo, 'Hands'), { method: 'HEAD'})
  if(handsResponse.ok) {
    paths.push(['ImgHands', pathFinding(characterInfo, "Hands")]);
  }
  
  for(let i = 0; i < paths.length; i++) {
    let img = document.createElement("img");
    img.id = paths[i][0];
    img.src = paths[i][1];
    img.className = "h-full w-full col-start-1 row-start-1 object-contain";
    CharacterBox.appendChild(img);
  }
}