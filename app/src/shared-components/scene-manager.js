import "../scenes/start-scene.js";
import "../scenes/settings-scene/settings-scene.js";
import "../scenes/novel-scene/novel-scene.js";
import "../scenes/novel-selector/novel-selector.js";
import "../scenes/links-scene/links-scene.js";
import "../scenes/novel-selector-sidebar.js";
import "../scenes/bookmarks-scene/bookmarks-scene.js";
import { TermsConsentScene } from "../scenes/terms-consent-scene/terms-consent-scene.js";
import "../scenes/legal_information/legal-information-scene.js";
import "../scenes/legal_information/dataprivacy-scene.js";
import "../scenes/legal_information/imprint-scene.js";
import "../scenes/legal_information/tos-scene.js";
import "../scenes/about-kite-scene/about-kite-scene.js";
import "../scenes/completion-scene/completion-scene.js";
import "../scenes/knowledge-scene/knowledge-scene.js";
import "../scenes/archive-scene/archive-scene.js";

class SceneManager extends HTMLElement {
  
  constructor() {
    super();
    this.sceneHistory = []; // Initialize scene history stack
    this.enterFirstTime = true;
  }

  connectedCallback() {
    console.log("Added New Scene Manager");

    this.addEventListener("sm-switch-scene", (event) => { this.switchScene(event.detail.scene, event.detail.args)});
    this.addEventListener("sm-clear-scene", (event) => { this.clearScene()});
    this.addEventListener("sm-back", () => { this.switchToLastScene() });

    if (TermsConsentScene.hasLegalConsentCached()) {
      this.switchScene("start-scene");
    } else {
      this.switchScene("terms-consent-scene");
    }
  }

  getCurrentScene() {
    if (this.childNodes.length === 0) {
      return false;
    }
    if(this.childNodes.length > 1) {
      throw `${this.childNodes.length} Scenes in DOM`;
    }
    return this.childNodes[0];
  }

  /**
   * Switches from the current scene to the provided new Scene.
   * @param {String} scene 
   * @param {Object} args 
   */
  switchScene(scene, args) {
    console.log(`Registered switchScene event: Switching to "${scene}"`);

    if (scene) {
      const newScene = document.createElement(scene);
      newScene.args = args;

      // Push the current scene to the history stack
      if (this.getCurrentScene() && !this.getCurrentScene().preventHistoryPush) {
        this.sceneHistory.push({ scene: this.getCurrentScene().tagName.toLowerCase(), args: this.getCurrentScene().args });
      }

      this.replaceChildren(newScene);
    }
  }
  
  /**
   * Removes the current Scene and Clears the Scene History
   */
  clearScene() {
    console.log("Registered clearScene event");
    // Remove all current scenes and reset history
    this.replaceChildren();
    this.sceneHistory = []; 
  }

  switchToLastScene() {
    if (this.sceneHistory.length > 0) {
      // Remove current scene from the stack
      const lastSceneData = this.sceneHistory.pop();

      // Create and load the previous scene
      const newScene = document.createElement(lastSceneData.scene.toLowerCase());
      newScene.args = lastSceneData.args;
      this.replaceChildren(newScene);
      
    } else {
      console.log("No previous scenes to switch to.");
    }
  }
}

customElements.define("scene-manager", SceneManager);
