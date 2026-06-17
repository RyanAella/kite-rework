import "../../shared-components/headers/back-header-component.js";
import { playAudio } from "../../shared-services/audio-playing-service.js";
import { addDragScrolling } from "../../shared-services/drag-scrolling-service.js";
import { fetchAiFeedback } from "../../shared-services/ai-feedback-service.js";
import { setAiFeedback } from "../../shared-services/progress-tracking-service.js";
import {
  createInformationPopup,
  showPinnedModal,
  hidePinnedModal,
} from "../../shared-services/information-popup-service.js";
import { CopyToast } from "../../shared-components/copy-toast-component.js";

const COPY_TOAST_TEXT = "Das Feedback wurde in die Zwischenablage kopiert.";

const ERROR_POPUP_TEXT = "Ein unerwarteter Serverfehler ist aufgetreten.";

const ERROR_POPUP_HEADING = "FEHLERMELDUNG";

const LOADING_INFO_TEXT =
  "Das Feedback wird gerade geladen. Dies dauert durchschnittlich zwischen 30 und 60 Sekunden. Solltest du nicht so lange warten wollen, kannst du dir das Feedback einfach im Archiv anschauen, sobald es fertig ist.";

const ERROR_TEXT = "Leider ist aktuell keine KI-Analyse verfügbar.";

const DISCLAIMER_TEXT =
  "Hinweis: Analyse und Feedback wurden durch KI künstlich erzeugt. Eine individuelle Beratung wird hierdurch nicht ersetzt.";

class CompletionScene extends HTMLElement {
  constructor() {
    super();
    this.feedbackText = "";
  }

  connectedCallback() {
    this.className = "relative flex flex-col w-full h-full bg-bright font-sans overflow-hidden";

    const header = document.createElement("back-header");
    header.addEventListener("sm-back", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.returnToMainMenu();
    });
    this.appendChild(header);

    this.contentContainer = document.createElement("div");
    this.contentContainer.className =
      "flex-1 overflow-y-auto px-[8cqw] flex flex-col items-center justify-start gap-[4.5cqw]";

    const heading = document.createElement("h1");
    heading.innerText = "KI-Analyse";
    heading.className = "text-[#14305d] text-[4.5cqw] font-bold mt-[8cqw]";
    this.heading = heading;

    this.appendChild(this.contentContainer);
    addDragScrolling(this.contentContainer);

    this.setupErrorPopup();

    playAudio("SFX_ResultKI");

    this.loadFeedback();
  }

  /**
   * Builds the information popup used to inform the user about errors.
   */
  setupErrorPopup() {
    this.popupContainer = document.createElement("div");
    this.popupContainer.className =
      "pointer-events-none absolute inset-0 z-[100] grid grid-cols-1 grid-rows-1";

    this.popup = createInformationPopup(ERROR_POPUP_TEXT);
    this.popup.setHeading(ERROR_POPUP_HEADING);
    this.popup.addEventListener("information-popup-close", () => {
      hidePinnedModal(this.popupContainer, this.popup);
    });

    this.popupContainer.appendChild(this.popup);
    this.appendChild(this.popupContainer);
    // Hide AFTER the popup is connected to the DOM: its connectedCallback resets
    // className on connect, which would otherwise wipe a "hidden" added earlier.
    this.popup.classList.add("hidden");
  }

  async loadFeedback() {
    const { dialogueText } = this.args || {};
    this.renderState("loading");

    const { ok, feedback } = await fetchAiFeedback(dialogueText || "");

    if (ok) {
      this.saveFeedbackToArchive(feedback);
      this.renderState("result", feedback);
    } else {
      this.renderState("error");
      showPinnedModal(this.popupContainer, this.popup);
    }
  }

  /**
   * Persists the AI feedback text to the matching archive entry.
   * @param {string} feedback The AI generated feedback text
   */
  saveFeedbackToArchive(feedback) {
    const storageKey = this.args?.storageKey;
    if (storageKey) setAiFeedback(storageKey, feedback);
  }

  renderState(state, feedbackText = "") {
    if (feedbackText) {
      this.feedbackText = feedbackText;
    }

    this.contentContainer.replaceChildren();

    this.contentContainer.appendChild(this.heading.cloneNode(true));

    if (state === "loading") {
      const topBtn = this.createActionButton(
        "FEEDBACK SPÄTER IM\nARCHIV LESEN",
        () => this.returnToMainMenu(),
      );
      const infoText = document.createElement("p");
      infoText.innerText = LOADING_INFO_TEXT;
      infoText.className =
        "user-font text-[#14305d] leading-[6cqw] text-left self-start";

      this.contentContainer.appendChild(topBtn);
      this.contentContainer.appendChild(infoText);
      this.contentContainer.appendChild(this.createDisclaimer());
      this.contentContainer.appendChild(this.createSpinner());
      return;
    }

    if (state === "result") {
      const topBtn = this.createActionButton();
      const feedbackEl = document.createElement("p");
      feedbackEl.innerText = this.feedbackText;
      feedbackEl.className =
        "user-font text-[#14305d] leading-[6cqw] text-left self-start whitespace-pre-line";

      const bottomBtn = this.createActionButton();

      this.contentContainer.appendChild(topBtn);
      this.contentContainer.appendChild(feedbackEl);
      this.contentContainer.appendChild(this.createDisclaimer());
      this.contentContainer.appendChild(this.createCopyButton());
      this.contentContainer.appendChild(bottomBtn);
      return;
    }

    // error
    const topBtn = this.createActionButton();
    const infoText = document.createElement("p");
    infoText.innerText = ERROR_TEXT;
    infoText.className =
      "user-font text-[#14305d] leading-[6cqw] text-left self-start";

    this.contentContainer.appendChild(topBtn);
    this.contentContainer.appendChild(infoText);
    this.contentContainer.appendChild(this.createDisclaimer());
  }

  createActionButton(
    label = "SCHLIESSEN UND IM\nARCHIV SPEICHERN",
    onClick = () => this.returnToMainMenu(),
  ) {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className =
      "border-[1.5px] border-[#14305d] text-[#14305d] font-bold text-[2.7cqw] py-[0.2cqw] px-[4cqw] rounded-[0.6cqw] whitespace-pre-line";
    btn.addEventListener("click", onClick);
    return btn;
  }

  createDisclaimer() {
    const disclaimerText = document.createElement("p");
    disclaimerText.innerText = DISCLAIMER_TEXT;
    disclaimerText.className =
      "user-font text-[#14305d] italic leading-[5.5cqw] text-center";
    return disclaimerText;
  }

  createSpinner() {
    const spinner = document.createElement("div");
    spinner.className =
      "w-[10cqw] h-[10cqw] rounded-full border-[1cqw] border-[#14305d]/20 border-t-[#14305d] animate-spin mt-[4cqw]";
    return spinner;
  }

  createCopyButton() {
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className =
      "flex flex-row h-[5cqw] items-center justify-center text-[4cqw] mt-[2cqw] mb-[2cqw] bg-transparent outline-none";

    const img = document.createElement("img");
    img.src = "assets/Images/Buttons/copy.png";
    img.className = "h-full pointer-events-none";
    img.alt = "";

    const label = document.createElement("p");
    label.className = "font-bold ml-[2cqw] text-[#14305d]";
    label.innerText = "Kopieren";

    copyBtn.appendChild(img);
    copyBtn.appendChild(label);

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(this.feedbackText);
      CopyToast.show(this, COPY_TOAST_TEXT);
    });

    return copyBtn;
  }

  returnToMainMenu() {
    this.dispatchEvent(
      new CustomEvent("sm-switch-scene", {
        detail: {
          scene: "novel-selector-scene",
          args: {
            fromCompletion: true,
            novelName: this.args?.novelName,
          },
        },
        bubbles: true,
      }),
    );
  }
}

customElements.define("completion-scene", CompletionScene);
