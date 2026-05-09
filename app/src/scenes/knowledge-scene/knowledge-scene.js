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

    // Dieses Event fängt das back button event im header ab um die card wieder auszubleneden wenn sie angezeigt
    // war, sodass nicht direkt zum menü geswitcht wird.
    this.addEventListener('sm-switch-scene', (e) => {
        // Wir suchen im DOM, ob gerade eine Detail-Karte existiert
        const activeOverlay = this.querySelector('card-overlay-component');
        const accordion = this.querySelector('accordion-element');

        if (activeOverlay && accordion) {
            // 1. Stoppt das Event! Der globale SceneManager wechselt die Szene NICHT.
            e.stopPropagation();
            
            // 2. Wir löschen die Karte restlos aus dem Speicher
            activeOverlay.remove();
            
            // 3. Wir blenden das Accordion und weitere Elemente mit dem alten Zustand wieder ein
            accordion.classList.remove('hidden');
            searchBar.classList.remove('hidden');
            const introText = document.getElementById("intro-text");
            const subIntro = document.getElementById("sub-intro");
            introText.classList.remove('hidden');
            subIntro.classList.remove('hidden');
        }
    });
    
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