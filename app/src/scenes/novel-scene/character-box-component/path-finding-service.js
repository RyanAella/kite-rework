
const baseImagePath = 'assets/Images/Character';

const expressionMap = {
  4 : "Amazed",
  6 : "Critical",
  1 : "Defeated",
  2 : "Dissatisfied",
  8 : "Laughing",
  11 : "Neutral",
  10 : "Neutral_Relaxed",
  12 : "Proud",
  5 : "Questioning",
  3 : "Rejecting",
  0 : "Scared",
  9 : "Smiling",
  7 : "Smiling_Big"
};

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
  // Inline character mapping - no function call overhead
  const charName = characterInfo.name;
  let folderName, filePrefix;
  
  // Subfolder characters (Eltern/Vater, Eltern/Mutter)
  if (charName === "Vater") { folderName = "Eltern/Vater"; filePrefix = "Vater"; }
  else if (charName === "Mutter") { folderName = "Eltern/Mutter"; filePrefix = "Mutter"; }
  
  // Regular character mappings
  else if (charName === "Intro") { folderName = "Einstieg"; filePrefix = "Einstieg"; }
  else if (charName === "Notarin") { folderName = "Notarin"; filePrefix = "Notarin"; }
  else if (charName === "Journalistin") { folderName = "Presse"; filePrefix = "Presse"; }
  else if (charName === "Vermieter") { folderName = "Vermieter"; filePrefix = "Vermieter"; }
  else if (charName === "Investor") { folderName = "Investor"; filePrefix = "Investor"; }
  else if (charName === "Sachbearbeiter") { folderName = "Bank"; filePrefix = "Bank"; }
  else if (charName === "Kundin") { folderName = "Honorar"; filePrefix = "Honorar"; }
  
  // Fallback for characters without images (None, Player, Info) or unknown characters
  else { folderName = characterInfo.novelName; filePrefix = characterInfo.novelName; }

  switch (imageType) {
    case "Clothes":
      return `${baseImagePath}/ClothesImages/${folderName}/${filePrefix}_Clothes_${characterInfo.clothesSpriteId}.png`;
    case "Headset":
      return `${baseImagePath}/ClothesImages/${folderName}/${filePrefix}_Headset.png`;
    case "Eyes":
      return `${baseImagePath}/EyesImages/${id}.png`;
    case "Face":
      return `${baseImagePath}/FaceImages/${expressionMap[id]}/${characterInfo.eyebrowType}_${expressionMap[id]}${speaking ? "_Speaking" : ""}.png`;
    case "Glasses":
      return `${baseImagePath}/GlassesImages/Glasses.png`;
    case "Hair":
      return `${baseImagePath}/HairImages/${folderName}/${filePrefix}_Hair_${characterInfo.hairSpriteId}.png`;
    case "Hands":
      return `${baseImagePath}/HandsImages/${folderName}/${filePrefix}_Hands_${characterInfo.skinSpriteId}.png`;
    case "Head":
      return `${baseImagePath}/HeadImages/${characterInfo.novelName === "Einstieg" ? "Einstieg_Head_1" : `Head_${characterInfo.headSpriteId}/Head_${characterInfo.headSpriteId}_${characterInfo.skinSpriteId}`}.png`;
  }
}