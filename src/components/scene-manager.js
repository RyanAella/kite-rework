import "./scenes/start-scene.js";


class SceneManager extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Added New Scene Manager");

    this.addEventListener("sm-switch-scene", (event) => { this.switch_scene(event)});
    this.addEventListener("sm-clear-scene", (event) => { this.clear_scene(event)});


    const startScene = document.createElement("start-scene");
    this.appendChild(startScene);


  }

  switch_scene(event) {
    const sceneName = event.detail?.scene;
    console.log(`Registered switch_scene event: Switching to "${sceneName}"`);

    if (event.detail && typeof event.detail.scene === 'string') {
      const newScene = document.createElement(event.detail.scene);
      this.replaceChildren(newScene);
    }
  }

  clear_scene(event) {
    console.log("Registered clear_scene event");
    this.replaceChildren();
  }
  
}

customElements.define("scene-manager", SceneManager);

