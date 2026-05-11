import { pathFinding } from "../path-finding-service.js";

export function animationSpeak(animationStatus, faceElement, characterInfo) {
  let speakAnimationFrame = 0;

  console.log("Starting animation Speak");
  const id = animationStatus["speakingId"];

  const animate = () => {
    if(animationStatus["speakingId"] == id) {
      faceElement.src = pathFinding(characterInfo, "Face", animationStatus["Expression"], speakAnimationFrame ? true : false);
      speakAnimationFrame = (++speakAnimationFrame) % 2;
      setTimeout(() => requestAnimationFrame(animate), 300);
    } else {
      faceElement.src = pathFinding(characterInfo, "Face", animationStatus["Expression"], false);
    }
  }
  requestAnimationFrame(animate);
}