import { fetchFromJson } from "../../../shared-services/fetch-service.js";
import { pathFinding } from "./path-finding-service.js";

const skinSprites = ['a','b','c','d'];
const headSpriteCount = 2;

// Character ohne Bilder (keine Bild-Ordner existieren)
const charactersWithoutImages = [0, 1, 4]; // None, Player, Info

/**
 * Fetches / Generates Information of a character
 * @param {string} novelName the Name of the currently played novel
 * @param {number} characterId the ID of the character
 * @returns character Information in an Object
 */
export async function characterInfoLoader(novelName, characterId) {

  let data = await fetchFromJson("assets/json/character-info.json");
  let characterInfo = data["characters"].filter(c => c.id == characterId)[0];

  if (!characterInfo) {
    // Fallback for missing characters (e.g., legacy or info characters)
    console.warn(`Character ${characterId} not found in character-info.json, using invisible default`);
    characterInfo = {
      id: characterId,
      name: null,
      positionX: 0,
      positionY: 0,
      glasses: false,
      headset: false,
      hasHands: false,
      maxHair: 1,
      maxClothes: 1
    };
  }

  characterInfo["novelName"] = novelName;

  // Character ohne Bilder: Setze alle Sprite-IDs auf 0, um Ladeversuche zu vermeiden
  if (charactersWithoutImages.includes(characterId)) {
    characterInfo["hairSpriteId"] = 0;
    characterInfo["clothesSpriteId"] = 0;
    characterInfo["skinSpriteId"] = "";
    characterInfo["headSpriteId"] = 0;
    characterInfo["eyebrowType"] = "";
    return characterInfo;
  }

  const maxHair = characterInfo.maxHair;
  const maxClothes = characterInfo.maxClothes;

  // Verwende Math.floor + 1 um sicherzustellen, dass Sprite-IDs immer >= 1 sind
  // (Es gibt keine _0.png Bilder, nur _1.png, _2.png, etc.)
  characterInfo["hairSpriteId"] = Math.floor(Math.random() * maxHair) + 1;
  characterInfo["clothesSpriteId"] = Math.floor(Math.random() * maxClothes) + 1;

  characterInfo["skinSpriteId"] = skinSprites[Math.floor(Math.random() * skinSprites.length)];
  characterInfo["headSpriteId"] = Math.floor(Math.random() * headSpriteCount) + 1;
  // Fester Augenbrauen-Typ für Einstieg und Hilfeplanung/Tochter
  if (novelName === "Einstieg" || novelName === "Hilfeplanung" || characterId === 13) {
    characterInfo["eyebrowType"] = "Strong";
  } else {
    characterInfo["eyebrowType"] = Math.random() > 0.5 ? "Fine" : "Strong";
  }

  return characterInfo;
}