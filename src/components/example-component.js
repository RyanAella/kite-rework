class ExampleComponent extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Added New Example Component");
    this.textContent = "Example Component"
    this.addEventListener("click", (event) => {
      console.log("Registered Click for Example Component");
      
      let sm = document.querySelector("scene-manager");
      sm.dispatchEvent(new CustomEvent("sm-switch-scene", {
        detail: {
          scene : "start-scene"
        }
      }));

    });
  }
}

customElements.define("example-component", ExampleComponent);
