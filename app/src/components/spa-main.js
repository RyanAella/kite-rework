import "./scene-manager.js";

class SpaMain extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {

    this.classList.add("spa-main-style", "bg_blue_ud", "overflow-hidden", "@container", "select-none");
    const sceneManager = document.createElement("scene-manager");
    this.appendChild(sceneManager);
  }
}

customElements.define("spa-main", SpaMain);
