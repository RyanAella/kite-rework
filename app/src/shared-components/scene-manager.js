import "../scenes/start-scene.js";
import "../scenes/settings-scene/settings-scene.js";
import "../scenes/novel-scene/novel-scene.js";
import "../scenes/novel-selector.js";
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
  }

  connectedCallback() {
    console.log("Added New Scene Manager");

    this.addEventListener("sm-switch-scene", (event) => { this.switchScene(event)});
    this.addEventListener("sm-clear-scene", (event) => { this.clearScene(event)});
    this.addEventListener("sm-back", () => { this.switchToLastScene() });

    if (TermsConsentScene.hasLegalConsentCached()) {
      const startScene = document.createElement("start-scene");
      this.appendChild(startScene);
      this.sceneHistory.push({ scene: "start-scene", args: null });
    } else {
      const termsScene = document.createElement("terms-consent-scene");
      this.appendChild(termsScene);
      this.sceneHistory.push({ scene: "terms-consent-scene", args: null });
    }
  }

  switchScene(event) {
    const sceneName = event.detail?.scene;
    console.log(`Registered switchScene event: Switching to "${sceneName}"`);

    if (event.detail && typeof event.detail.scene === 'string') {
      const newScene = document.createElement(event.detail.scene);
      newScene.args = event.detail.args;

      // Push the new scene to the history stack
      this.sceneHistory.push({ scene: sceneName, args: event.detail?.args });

      this.replaceChildren(newScene);
    }
  }
  
  clearScene(event) {
    console.log("Registered clearScene event");
    // Remove all current scenes and reset history
    this.replaceChildren();
    this.sceneHistory = []; 
  }

  switchToLastScene() {
    if (this.sceneHistory.length > 1) {
      // Remove current scene from the stack
      this.sceneHistory.pop();

      // Special-case: if a scene was opened from about-kite via a path
      // that inserted novel-selector in between, "Zurück" should still
      // return to about-kite-scene.
      const previousScene = this.sceneHistory[this.sceneHistory.length - 1];
      const beforePreviousScene = this.sceneHistory[this.sceneHistory.length - 2];
      if (
        this.sceneHistory.length > 1 &&
        previousScene?.scene === "novel-selector" &&
        beforePreviousScene?.scene === "about-kite-scene"
      ) {
        this.sceneHistory.pop();
      }

      // Create and load the previous scene
      const lastSceneData = this.sceneHistory[this.sceneHistory.length - 1];
      const newScene = document.createElement(lastSceneData.scene.toLowerCase());
      newScene.args = lastSceneData.args;
      this.replaceChildren(newScene);
      
    } else {
      console.log("No previous scenes to switch to.");
    }
  }
}

customElements.define("scene-manager", SceneManager);
