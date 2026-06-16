import { pathFinding } from "./path-finding-service.js";

/**
 * Creates the pieces of the Character.
 * @param {*} CharacterBox the Container, where the pieces of the Character are added into
 * @param {*} characterInfo the Information of about the Character created by the CharacterInfoLoader
 */
export async function addElements(CharacterBox, characterInfo) {
  let paths = []
  paths.push(['ImgHead', pathFinding(characterInfo, "Head"), "z-30"]);
  paths.push(['ImgHair', pathFinding(characterInfo, "Hair"), "z-30"]);
  paths.push(['ImgClothes', pathFinding(characterInfo, "Clothes"), "z-30"]);
  paths.push(['ImgFace', pathFinding(characterInfo, "Face", 5, false), "z-30"]);
  paths.push(['ImgEyes', pathFinding(characterInfo, "Eyes", "Eyes_Open"), "z-30"]);
  if(characterInfo["glasses"]) paths.push(['ImgGlasses', pathFinding(characterInfo, "Glasses"), "z-30"]);
  if(characterInfo["headset"]) paths.push(['ImgHeadset', pathFinding(characterInfo, "Headset"), "z-30"]);
  
  //Hands
  if(characterInfo["hasHands"]) {
    paths.push(['ImgHands', pathFinding(characterInfo, "Hands"), "z-40"]);
  }
  
  for(let i = 0; i < paths.length; i++) {
    let img = document.createElement("img");
    img.id = paths[i][0];
    img.src = paths[i][1];
    img.className = `pointer-events-none absolute w-[75cqw] col-start-1 row-start-1 object-contain ${paths[i][2]}`;
    img.style.left = `${characterInfo["positionX"]}cqw`;
    img.style.top = `${characterInfo["positionY"]}cqw`;
    img.style.rotate = "0deg";
    CharacterBox.appendChild(img);
  }
}