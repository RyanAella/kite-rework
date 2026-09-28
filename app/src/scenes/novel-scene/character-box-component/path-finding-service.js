import { getExpressionFolder } from "../../../shared-services/mapping-service.js";

const baseImagePath = 'assets/Images/Character';

/**
 * Inline character-to-folder mapping for maximum performance.
 * Directly maps character names to their folder paths and file prefixes in a single pass.
 * 
 * @param {String} imageType
 * @param {} id
 * @param {boolean} speaking only for FaceImages
 * @returns the Full path of the requested resource
 */
export function pathFinding(characterInfo, imageType, id, speaking) {
  // Folder comes from character-info.json (folderName); only image-less
  // characters (None, Player, Info) fall back to the novel name.
  const folderName = characterInfo.folderName || characterInfo.novelName;
  const filePrefix = folderName.includes("/") ? folderName.split("/").pop() : folderName;

  switch (imageType) {
    case "Clothes":
      return `${baseImagePath}/ClothesImages/${folderName}/${filePrefix}_Clothes_${characterInfo.clothesSpriteId}.png`;
    case "Headset":
      return `${baseImagePath}/ClothesImages/${folderName}/${filePrefix}_Headset.png`;
    case "Eyes":
      return `${baseImagePath}/EyesImages/${id}.png`;
    case "Face":
      const expressionFolder = getExpressionFolder(id);
      return `${baseImagePath}/FaceImages/${expressionFolder}/${characterInfo.eyebrowType}_${expressionFolder}${speaking ? "_Speaking" : ""}.png`;
    case "Glasses":
      return `${baseImagePath}/GlassesImages/Glasses.png`;
    case "Hair":
      return `${baseImagePath}/HairImages/${folderName}/${filePrefix}_Hair_${characterInfo.hairSpriteId}.png`;
    case "Hands":
      return `${baseImagePath}/HandsImages/${folderName}/${filePrefix}_Hands_${characterInfo.skinSpriteId}.png`;
    case "Head":
      return `${baseImagePath}/HeadImages/${(characterInfo.novelName === "Einstieg" || characterInfo.novelName === "Hilfeplanung") ? "Einstieg_Head_1" : `Head_${characterInfo.headSpriteId}/Head_${characterInfo.headSpriteId}_${characterInfo.skinSpriteId}`}.png`;
  }
}