import "./scene-manager.js";
import { diasableImageDragging } from "../services/disable-image-drag.js";

class SpaMain extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {

    this.classList.add("spa-main-style", "bg-blue-ud", "overflow-hidden", "@container", "select-none");
    const sceneManager = document.createElement("scene-manager");
    this.appendChild(sceneManager);

    diasableImageDragging();
  }
}

customElements.define("spa-main", SpaMain);
