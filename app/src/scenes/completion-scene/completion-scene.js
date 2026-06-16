import "../../shared-components/headers/back-header-component.js";
import { playAudio } from "../../shared-services/audio-playing-service.js";

class CompletionScene extends HTMLElement {

  connectedCallback() {
    this.className = "flex flex-col w-full h-full bg-bright font-sans overflow-hidden";

    // 2. Header-Integration
    const header = document.createElement("back-header");
    header.addEventListener('sm-back', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.returnToMainMenu();
    });
    this.appendChild(header);

    // 3. Main Content Area (Centered Layout)
    const contentContainer = document.createElement("div");
    contentContainer.className = "flex-1 overflow-y-auto px-[8cqw] flex flex-col items-center justify-start gap-[4.5cqw]";

    // --- Generating Elements ---
    
    const heading = document.createElement("h1");
    heading.innerText = "KI-Analyse";
    heading.className = "text-[#14305d] text-[4.5cqw] font-bold mt-[8cqw]";

    // Top Button (Instance 1)
    const topBtn = this.createActionButton();

    // Here will be later on the content dynamically set from the AI.
    const infoText = document.createElement("p");
    infoText.innerText = "Leider ist aktuell keine KI-Analyse verfügbar.";
    infoText.className = "user-font text-[#14305d] leading-[6cqw] text-left self-start";

    const disclaimerText = document.createElement("p");
    disclaimerText.innerText = "Hinweis: Analyse und Feedback wurden durch KI künstlich erzeugt. Eine individuelle Beratung wird hierdurch nicht ersetzt.";
    disclaimerText.className = "user-font text-[#14305d] italic leading-[5.5cqw] text-center";

    // Bottom Button (Instance 2)
    const bottomBtn = this.createActionButton();

    // --- Composing DOM-Tree ---
    contentContainer.appendChild(heading);
    contentContainer.appendChild(topBtn);
    contentContainer.appendChild(infoText);
    contentContainer.appendChild(disclaimerText);
    contentContainer.appendChild(bottomBtn);

    playAudio("SFX_ResultKI");

    this.appendChild(contentContainer);
  }

  /**
   * Created the Button for returning to the novel-selector
   * @returns The Button HTML Element
   */
  createActionButton() {
    const btn = document.createElement("button");
    btn.innerText = "SCHLIESSEN UND IM\nARCHIV SPEICHERN";  // whitespace-pre-line allows the use of '\n'
    btn.className = "border-[1.5px] border-[#14305d] text-[#14305d] font-bold text-[2.7cqw] py-[0.2cqw] px-[4cqw] rounded-[0.6cqw] whitespace-pre-line";
    btn.addEventListener("click", () => this.returnToMainMenu());
    return btn;
  }

  /**
   * Emmits an event to switch to the Novel Selector
   */
  returnToMainMenu() {
    this.dispatchEvent(new CustomEvent("sm-switch-scene", {
      detail: { 
        scene: "novel-selector-scene",
        args: { 
          fromCompletion: true,
          novelName: this.args.novelName
        }
      },
      bubbles: true
    }));
  }
}

customElements.define("completion-scene", CompletionScene);