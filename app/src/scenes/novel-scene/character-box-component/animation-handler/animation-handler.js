import { pathFinding } from "../path-finding-service.js";

import { animationBlink } from "./animation-blink-service.js";
import { animationSpeak } from "./animation-speak-service.js";
import { animationScared } from "./animation-scared-service.js";
import { animationAmazed } from "./animation-amazed-service.js";
import { animationQuestioning } from "./animation-questioning-service.js";
import { CharacterBox } from "../character-box-component.js";

export class AnimationHandler {

  characterBox;
  faceElement;
  eyesElement;
  styles;

  animationStatus = {
    "blinking": false,
    "speakingId": null,
    "Expression": 0
  }

  /**
   * Constructor.
   * @param {CharacterBox} characterBox the Character Box this AnimationHandler affects
   */
  constructor(characterBox) {
    this.characterBox = characterBox;
    this.faceElement = characterBox.querySelector("#ImgFace");
    this.eyesElement = characterBox.querySelector("#ImgEyes");

    this.styles = Array.from(characterBox.childNodes).map(child => child.style);
    this.styles = this.styles.concat(characterBox.characterObjectSync.map(object => object.style));

    this.setBlinkingState(true);
  }

  /**
   * Sets the characters Expression and triggers animations if neccessary
   * @param {number} expressionId The ID of the Expression switched to
   */
  updateCharacterExpression(expressionId) {
    this.animationStatus["Expression"] = expressionId;
    this.faceElement.src = pathFinding(this.characterBox.characterInfo, "Face", this.animationStatus["Expression"], false);

    // Play animations based on new Expression
    switch(expressionId) {
      case 0: animationScared(this.styles, this.characterBox.characterInfo); break;
      case 4: animationAmazed(this.styles); break;
      case 5: animationQuestioning(this.styles); break;
    }
  }

  /**
   * Starts / Stops the blinking animation loop.
   * @param {boolean} value
   */
  setBlinkingState(value) {
    this.animationStatus["blinking"] = value;
    if (value) animationBlink(this.animationStatus, this.eyesElement, this.characterBox.characterInfo);
  }

  /**
   * Starts / Stops the speaking animation.
   * @param {*} value 
   */
  setSpeakingState(value) {
    if((this.animationStatus["speakingId"] == null) != value) return;
    
    if (value) {
      this.animationStatus["speakingId"] = crypto.randomUUID();
      animationSpeak(this.animationStatus, this.faceElement, this.characterBox.characterInfo);
    } else {
      this.animationStatus["speakingId"] = null;
    }
  }
}