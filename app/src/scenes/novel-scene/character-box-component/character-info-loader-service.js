import { pathFinding } from "./path-finding-service.js";

const skinSprites = ['a','b','c','d'];
const headSpriteCount = 2;

export async function characterInfoLoader(novelName, characterId) {
  console.log("novelCharacterGenerating");

  let response = await fetch("assets/json/character-info.json");
  let data = await response.json();
  let characterInfo = data["characters"].filter(c => c.id == characterId)[0];

  characterInfo["novelName"] = novelName;
  //novelName
  //hairSpriteId
  //clothesSpriteId
  //eyebrowType
  //headSpriteId
  //skinSpriteId

  // HairSpriteId
  for(let i = 1; true; i++) {
    characterInfo["hairSpriteId"] = i;
    const response = await fetch(pathFinding(characterInfo, "Hair"), {method : 'HEAD'});
    if(!response.ok) {
      characterInfo["hairSpriteId"] = Math.ceil(Math.random() * (i-1));
      break;
    }
  }
   // ClothesSpriteId
  for(let i = 1; true; i++) {
    characterInfo["clothesSpriteId"] = i;
    const response = await fetch(pathFinding(characterInfo, "Clothes"), { method: 'HEAD' });
    if(!response.ok) {
      characterInfo["clothesSpriteId"] = Math.ceil(Math.random() * (i-1));
      break;
    }
  }

  characterInfo["skinSpriteId"] = skinSprites[Math.floor(Math.random() * skinSprites.length)];
  characterInfo["headSpriteId"] = Math.ceil(Math.random() * headSpriteCount);
  characterInfo["eyebrowType"] = Math.random() > 0.5 ? "Fine" : "Strong";

  return characterInfo;
}