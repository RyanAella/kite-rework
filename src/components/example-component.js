class ExampleComponent extends HTMLButtonElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Added New Example Component");
    this.textContent = "Example Component"
    this.addEventListener("click", (event) => {
      console.log("Registered CLick for Example Component");
    });
  }
}

customElements.define("example-component", ExampleComponent, {extends:"button"});
