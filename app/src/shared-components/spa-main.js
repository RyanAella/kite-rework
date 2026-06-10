import "./scene-manager.js";
import { diasableImageDragging } from "../shared-services/disable-image-drag.js";
import { ensureSettingsDefaults } from "../shared-services/app-settings-session-service.js";
import { applyUserFontSize } from "../shared-services/user-font-size-service.js";

class SpaMain extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    ensureSettingsDefaults();
    applyUserFontSize();

    this.classList.add("spa-main-style", "bg-blue-ud", "overflow-hidden", "@container", "select-none");

    const sceneManager = document.createElement("scene-manager");
    this.appendChild(sceneManager);

    diasableImageDragging();
  }
}

customElements.define("spa-main", SpaMain);
