
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
 * 
 * @param {String} imageType
 * @param {} id
 * @param {boolean} speaking only for FaceImages
 * @returns the Full path of the requested resource
 */
export function pathFinding(characterInfo, imageType, id, speaking) {
  switch (imageType) {
    case "Clothes":
      return `${baseImagePath}/ClothesImages/${characterInfo["novelName"]}/${characterInfo["name"] ? `${characterInfo["name"]}/${characterInfo["name"]}` : characterInfo["novelName"]}_Clothes_${characterInfo["clothesSpriteId"]}.png`;
    case "Headset":
      return `${baseImagePath}/ClothesImages/${characterInfo["novelName"]}/${characterInfo["name"] ? `${characterInfo["name"]}/${characterInfo["name"]}` : characterInfo["novelName"]}_Headset.png`;
    case "Eyes":
      return `${baseImagePath}/EyesImages/${id}.png`;
    case "Face":
      return `${baseImagePath}/FaceImages/${expressionMap[id]}/${characterInfo["eyebrowType"]}_${expressionMap[id]}${speaking ? "_Speaking" : ""}.png`;
    case "Glasses":
      return `${baseImagePath}/GlassesImages/Glasses.png`;
    case "Hair":
      return `${baseImagePath}/HairImages/${characterInfo["novelName"]}/${characterInfo["name"] ? `${characterInfo["name"]}/${characterInfo["name"]}` : characterInfo["novelName"]}_Hair_${characterInfo["hairSpriteId"]}.png`;
    case "Hands":
      return `${baseImagePath}/HandsImages/${characterInfo["novelName"]}/${characterInfo["name"] ? `${characterInfo["name"]}/${characterInfo["name"]}` : characterInfo["novelName"]}_Hands_${characterInfo["skinSpriteId"]}.png`;
    case "Head":
      return `${baseImagePath}/HeadImages/${characterInfo["novelName"] === "Einstieg" ? "Einstieg_Head_1" : `Head_${characterInfo["headSpriteId"]}/Head_${characterInfo["headSpriteId"]}_${characterInfo["skinSpriteId"]}`}.png`;
  }
}