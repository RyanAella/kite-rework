import { fetchFromJson } from "../../../shared-services/fetch-service.js";
import { pathFinding } from "./path-finding-service.js";

const skinSprites = ['a','b','c','d'];
const headSpriteCount = 2;

/**
 * Fetches / Generates Information of a character
 * @param {string} novelName the Name of the currently played novel
 * @param {number} characterId the ID of the character
 * @returns character Information in an Object
 */
export async function characterInfoLoader(novelName, characterId) {

  let data = await fetchFromJson("assets/json/character-info.json");
  let characterInfo = data["characters"].filter(c => c.id == characterId)[0];

  if (!characterInfo) return null;

  characterInfo["novelName"] = novelName;

  const maxHair = characterInfo.maxHair;
  const maxClothes = characterInfo.maxClothes;

  characterInfo["hairSpriteId"] = Math.ceil(Math.random() * maxHair);
  characterInfo["clothesSpriteId"] = Math.ceil(Math.random() * maxClothes);

  characterInfo["skinSpriteId"] = skinSprites[Math.floor(Math.random() * skinSprites.length)];
  characterInfo["headSpriteId"] = Math.ceil(Math.random() * headSpriteCount);
  characterInfo["eyebrowType"] = Math.random() > 0.5 ? "Fine" : "Strong";

  return characterInfo;
}