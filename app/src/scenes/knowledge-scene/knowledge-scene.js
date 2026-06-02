import "./container-component.js";
import "./searchbar-component.js";
import "./accordion-component.js"

class KnowledgeScene extends HTMLElement {
  
  constructor() {
    super();
    // Speichert Referenzen zu allen DOM-Karten
    this.cardElements = []; 
    this.categoryElements = [];
  }

  async connectedCallback() {
    const containerComponent = document.createElement("container-component");
    this.appendChild(containerComponent)

    this.mainScrollContainer = containerComponent.querySelector("#main-scroll-container");

    const searchBar = document.createElement("searchbar-component");
    searchBar.args = { cards: this.cardElements, categories: this.categoryElements }
    this.mainScrollContainer.appendChild(searchBar);

    this.buildHeadingAndDesc();

    const accordion = document.createElement("accordion-element");
    accordion.args = { cards: this.cardElements, categories: this.categoryElements }

    this.mainScrollContainer.appendChild(accordion);
  }


  // Creates the intro text and the heading above it
  buildHeadingAndDesc() {
    // Intro Heading unter der Suche
    const introText = document.createElement('h2');
    introText.id = "intro-text";
    introText.innerText = "Biases im Gründungsprozess";
    introText.className = "text-[#14305d] text-[4.5cqw] text-center mb-[2cqw]";
    
    // Intro Text unter der Suche
    const subIntro = document.createElement('p');
    subIntro.id = "sub-intro";
    subIntro.innerText = "Wirst du anders bewertet, weil du eine Frau bist? Hier findest du die gängigsten Biases – einfach erklärt mit Beispielen aus echten Gründungssituationen.";
    subIntro.className = "text-[#14305d] text-[3.5cqw] text-left leading-[5cqw] mb-[8cqw]";

    this.mainScrollContainer.appendChild(introText);
    this.mainScrollContainer.appendChild(subIntro);
  }
}

customElements.define("knowledge-scene", KnowledgeScene);