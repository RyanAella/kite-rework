import { pathFinding } from "./path-finding-service.js";
import { characterInfoLoader } from "./character-info-loader-service.js";
import { addElements } from "./add-elements-service.js";
import { AnimationHandler } from "./animation-handler/animation-handler.js";

export class CharacterBox extends HTMLElement {
  
  novelName;
  characterId;
  characterInfo;
  animationHandler;
  characterObjectSync;

  static async create(novelName, characterId, characterObjectSync) {
    console.log("Creating CharacterBox");
    const newCharacterBox = document.createElement('character-box');
    newCharacterBox.novelName = novelName;
    newCharacterBox.characterId = characterId;
    newCharacterBox.characterObjectSync = characterObjectSync;
    await newCharacterBox.load();
    return newCharacterBox
  }

  disconnectedCallback() {
    this.animationHandler.setBlinkingState(false);
  }

  async load() {
    console.log("Load");
    this.classList = "grid grid-cols-1 grid-rows-1 origin-[50%_20%]";
    this.id = `character-${this.characterId}`
    this.characterInfo = await characterInfoLoader(this.novelName, this.characterId);
    console.log(this.characterInfo);

    await addElements(this, this.characterInfo);

    this.animationHandler = new AnimationHandler(this);
    console.log("Loaded");
  }

  
  updateCharacterExpression(expressionId) {
    this.animationHandler.updateCharacterExpression(expressionId);
  }

  setSpeakingState(value) {
    this.animationHandler.setSpeakingState(value);
  }

}

customElements.define("character-box", CharacterBox);