class StartScene extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Starting");
    const sm = document.querySelector('scene-manager');
    sm.dispatchEvent(new CustomEvent("sm-switch-scene", {
      detail: {
        scene : "example-component"
      }
    }));
  }
}

customElements.define("start-scene", StartScene);
