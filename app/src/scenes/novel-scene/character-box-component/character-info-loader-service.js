import { pathFinding } from "./path-finding-service.js";

const skinSprites = ['a','b','c','d'];
const headSpriteCount = 2;

export async function characterInfoLoader(novelName, characterId) {
  console.log("novelCharacterGenerating");

  let response = await fetch("assets/json/character-info.json");
  let data = await response.json();
  let characterInfo = data["characters"].filter(c => c.id == characterId)[0];

  if (!characterInfo) return null;

  characterInfo["novelName"] = novelName;
  //novelName
  //hairSpriteId
  //clothesSpriteId
  //eyebrowType
  //headSpriteId
  //skinSpriteId

  const maxHair = characterInfo.maxHair;
  const maxClothes = characterInfo.maxClothes;

  characterInfo["hairSpriteId"] = Math.ceil(Math.random() * maxHair);
  characterInfo["clothesSpriteId"] = Math.ceil(Math.random() * maxClothes);

  characterInfo["skinSpriteId"] = skinSprites[Math.floor(Math.random() * skinSprites.length)];
  characterInfo["headSpriteId"] = Math.ceil(Math.random() * headSpriteCount);
  characterInfo["eyebrowType"] = Math.random() > 0.5 ? "Fine" : "Strong";

  return characterInfo;
}