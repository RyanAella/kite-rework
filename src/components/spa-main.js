import "./scene-manager.js";

class SpaMain extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    const sceneManager = document.createElement("scene-manager");
    this.appendChild(sceneManager);
  }
}

customElements.define("spa-main", SpaMain);
