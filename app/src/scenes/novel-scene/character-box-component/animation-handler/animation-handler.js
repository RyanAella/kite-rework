import { pathFinding } from "../path-finding-service.js";

import { animationBlink } from "./animation-blink-service.js";
import { animationSpeak } from "./animation-speak-service.js";
import { animationScared } from "./animation-scared-service.js";
import { animationAmazed } from "./animation-amazed-service.js";
import { animationQuestioning } from "./animation-questioning-service.js";

export class AnimationHandler {

  characterBox;
  faceElement;
  eyesElement;

  animationStatus = {
    "blinking": false,
    "speakingId": null,
    "Expression": 0
  }

  constructor(characterBox) {
    this.characterBox = characterBox;
    this.faceElement = characterBox.querySelector("#ImgFace");
    this.eyesElement = characterBox.querySelector("#ImgEyes");

    this.setBlinkingState(true);
  }

  updateCharacterExpression(expressionId) {
    this.animationStatus["Expression"] = expressionId;
    this.faceElement.src = pathFinding(this.characterBox.characterInfo, "Face", this.animationStatus["Expression"], false);

    // Play animations based on new Expression
    switch(expressionId) {
      case 0: animationScared(this.characterBox.style, this.characterBox.characterInfo); break;
      case 4: animationAmazed(this.characterBox.style, this.characterBox.characterInfo); break;
      case 5: animationQuestioning(this.characterBox.style, this.characterBox.characterInfo); break;
    }
  }

  setBlinkingState(value) {
    this.animationStatus["blinking"] = value;
    console.log(this.eyesElement);
    if (value) animationBlink(this.animationStatus, this.eyesElement, this.characterBox.characterInfo);
  }

  setSpeakingState(value) {
    if((this.animationStatus["speakingId"] == null) != value) return;
    console.log("setSpeakingState " + value);
    if (value) {
      this.animationStatus["speakingId"] = crypto.randomUUID();
      animationSpeak(this.animationStatus, this.faceElement, this.characterBox.characterInfo);
    } else {
      this.animationStatus["speakingId"] = null;
    }
  }
}