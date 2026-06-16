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

  /**
   * Creates a new character box.
   * @param {string} novelName the name of the novel that is currently active
   * @param {number} characterId the ID of this character
   * @param {Object} characterObjectSync An object that matches interactiveObjects to the Characters they are synced with
   * @returns the new CharacterBox
   */
  static async create(novelName, characterId, characterObjectSync) {
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

  /**
   * Loads in all contents of this component.
   */
  async load() {
    this.classList = "grid grid-cols-1 grid-rows-1 origin-[50%_20%]";
    this.id = `character-${this.characterId}`
    this.characterInfo = await characterInfoLoader(this.novelName, this.characterId);

    await addElements(this, this.characterInfo);

    this.animationHandler = new AnimationHandler(this);
  }

  /**
   * Changes the Expression of this character
   * @param {number} expressionId the ID of the expression changed to
   */
  updateCharacterExpression(expressionId) {
    this.animationHandler.updateCharacterExpression(expressionId);
  }

  /**
   * Start / Stop the speaking animation of this character.
   * @param {boolean} value 
   */
  setSpeakingState(value) {
    this.animationHandler.setSpeakingState(value);
  }

}

customElements.define("character-box", CharacterBox);