import "./scene-manager.js";

class SpaMain extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {

    this.classList.add("spa-main-style", "bg_blue_ud");
    this.innerHTML = `
          <div id="scene_manager_container" class="w-full h-full relative @container"></div>`

      
    const smc = this.querySelector('#scene_manager_container');

    const sceneManager = document.createElement("scene-manager");
    smc.appendChild(sceneManager);

  }
}

customElements.define("spa-main", SpaMain);
