import "./scene-manager.js";

class SpaMain extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    const sceneManager = document.createElement("scene-manager");
    this.classList.add("flex", "justify-self-center", "justify-center", "h-dvh", "w-1/3");
    this.appendChild(sceneManager);

  }
}

customElements.define("spa-main", SpaMain);
