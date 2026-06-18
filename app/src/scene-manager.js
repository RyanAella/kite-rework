import "./scenes/loading-scene/loading-scene.js";
import "./scenes/start-scene/start-scene.js";
import "./scenes/settings-scene/settings-scene.js";
import "./scenes/novel-scene/novel-scene.js";
import "./scenes/novel-selector-scene/novel-selector-scene.js";
import "./scenes/links-scene/links-scene.js";
import "./scenes/novel-selector-sidebar-scene/novel-selector-sidebar-scene.js";
import "./scenes/bookmarks-scene/bookmarks-scene.js";
import { TermsConsentScene } from "./scenes/terms-consent-scene/terms-consent-scene.js";
import "./scenes/legal-information-scene/legal-information-scene.js";
import "./scenes/legal-information-scene/dataprivacy-scene.js";
import "./scenes/legal-information-scene/imprint-scene.js";
import "./scenes/legal-information-scene/tos-scene.js";
import "./scenes/about-kite-scene/about-kite-scene.js";
import "./scenes/completion-scene/completion-scene.js";
import "./scenes/knowledge-scene/knowledge-scene.js";
import "./scenes/archive-scene/archive-scene.js";

class SceneManager extends HTMLElement {
  
  constructor() {
    super();
    this.sceneHistory = []; // Initialize scene history stack
    this.enterFirstTime = true;
  }

  connectedCallback() {
    
    this.addEventListener("sm-switch-scene", (event) => { this.switchScene(event.detail.scene, event.detail.args)});
    this.addEventListener("sm-clear-scene", (event) => { this.clearScene()});
    this.addEventListener("sm-back", () => { this.switchToLastScene() });

    this.switchScene("loading-scene");
  }

  /**
   * Gets the currently active scene out of the DOM
   * @returns a reference to the current scene
   */
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

    if (!scene) return;

    const current = this.getCurrentScene();
    // Do not reopen the scene that is already active, so we don't stack
    // duplicate history entries (e.g. tapping settings/legal repeatedly).
    if (current && current.tagName.toLowerCase() === scene.toLowerCase()) {
      return;
    }

    const newScene = document.createElement(scene);
    newScene.args = args;

    // Push the current scene to the history stack
    if (current && !current.preventHistoryPush) {
      this.sceneHistory.push({ scene: current.tagName.toLowerCase(), args: current.args });
    }

    this.replaceChildren(newScene);
  }
  
  /**
   * Removes the current Scene and Clears the Scene History.
   */
  clearScene() {
    console.log("Registered clearScene event");
    // Remove all current scenes and reset history
    this.replaceChildren();
    this.sceneHistory = []; 
  }

  /**
   * Switched to the Last scene that was saved in the scene History.
   */
  switchToLastScene() {
    if (this.sceneHistory.length > 0) {
      // Remove current scene from the stack
      const lastSceneData = this.sceneHistory.pop();

      // Create and load the previous scene
      const newScene = document.createElement(lastSceneData.scene.toLowerCase());
      newScene.args = lastSceneData.args;
      this.replaceChildren(newScene);
      
    } else {
      console.warn("No previous scenes to switch to.");
    }
  }
}

customElements.define("scene-manager", SceneManager);
