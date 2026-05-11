import { pathFinding } from "../path-finding-service.js";

export function animationBlink(animationStatus, eyesElement, characterInfo) {
  const blinkAnimationOrder = {
    0:"Eyes_Open",
    1:"Eyes_Half_Open",
    2:"Eyes_Closed",
    3:"Eyes_Half_Open",
    4:"Eyes_Open",
    frames:5,
    currentFrame:0
  };

  function animate() {
    eyesElement.src = pathFinding(characterInfo, "Eyes", blinkAnimationOrder[blinkAnimationOrder['currentFrame']++]);
    if(blinkAnimationOrder['currentFrame'] < blinkAnimationOrder['frames']) {
      setTimeout(() => requestAnimationFrame(animate), 100);
    } else {
      if(animationStatus["blinking"]) {
        blinkAnimationOrder['currentFrame'] = 0;
        setTimeout(() => requestAnimationFrame(animate), Math.random() * 5000 + 500);
      }
    }
  }
  requestAnimationFrame(animate);
}