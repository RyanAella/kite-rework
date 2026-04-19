import "./scene-manager.js";

class SpaMain extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {

    this.classList.add("spa-main-style", "bg_blue_ud");
    this.innerHTML = `
      <svg viewBox="0 0 1000 2000" class="w-full h-full">
        <foreignObject x="0" y="0" width="1000" height="2000">
          <div id="scene_manager_container" class="w-full h-full"></div>
        </foreignObject>
      </svg>`

      
    const smc = this.querySelector('#scene_manager_container');

    const sceneManager = document.createElement("scene-manager");
    smc.appendChild(sceneManager);

  }
}

customElements.define("spa-main", SpaMain);
