import { mountTermsAccordion } from "./term-accordion-component.js";
import { buildConsentCheckbox } from "./consent-checkbox-component.js";
import { addDragScrolling } from "../../shared-services/drag-scrolling-service.js";
import { fetchFromJson } from "../../shared-services/fetch-service.js";

// Storage key for the legal consent
const LEGAL_CONSENT_STORAGE_KEY = "kite-legal-consent";

// Checkboxes for the terms consent scene
const CONSENT_CHECKBOXES = [
  {
    id: "terms-cb-tos",
    label: "Ich stimme den Nutzungsbedingungen zu.",
  },
  {
    id: "terms-cb-privacy",
    label:
      "Ich habe die Datenschutzerklärung zur Kenntnis genommen und gesehen, dass die App KITE maximal datensparsam ist.",
  },
];

// Classes for the disabled continue button
const BTN_DISABLED_CLASSES = ["opacity-40", "pointer-events-none", "cursor-not-allowed"];

// Terms consent scene class
export class TermsConsentScene extends HTMLElement {

  // True when the user has previously agreed to the terms
  static hasLegalConsentCached() {
    try {
      return localStorage.getItem(LEGAL_CONSENT_STORAGE_KEY) != null;
    } catch (_) {
      return false;
    }
  }

  // Persist that the user agreed to the terms
  static saveLegalConsent() {
    try {
      localStorage.setItem(LEGAL_CONSENT_STORAGE_KEY, "accepted");
    } catch (_) {
      // ignore quota / private mode
    }
  }

  async connectedCallback() {
    this.innerHTML = this.buildMarkup();

    this.scrollContainer = this.querySelector("#terms-scroll-container");
    this.accSlot = this.querySelector("#terms-acc-root");
    this.btn = this.querySelector("#terms-continue-btn");
    this.checkboxes = CONSENT_CHECKBOXES.map(({ id }) => this.querySelector(`#${id}`));
    if (!this.accSlot || !this.btn || this.checkboxes.some((c) => !c)) return;

    addDragScrolling(this.scrollContainer);
    await mountTermsAccordion(this.accSlot);
    this.wireConsentForm();
  }

  // Build the markup for the terms consent scene
  buildMarkup() {
    return `
      <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-blue bg-cover bg-top font-sans text-white">
        <div id="terms-scroll-container" class="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-[6cqw] py-[6cqw] no-scrollbar">
          ${this.buildLogo()}
          <div id="terms-acc-root" class="flex w-full shrink-0 flex-col pb-[8cqw]"></div>
          ${this.buildCheckboxGroup()}
          ${this.buildContinueButton()}
        </div>
      </div>
    `;
  }

  // Build the logo for the terms consent scene
  buildLogo() {
    return `
      <div class="flex w-full shrink-0 justify-center pt-[18cqw] pb-[6cqw]">
        <img
          src="assets/Images/IconsAndLogos/Logo_Kite_Lettering_White.png"
          alt="kite"
          class="pointer-events-none w-[24%] max-w-[100px] object-contain select-none"
        />
      </div>
    `;
  }

  // Build the checkbox group for the terms consent scene
  buildCheckboxGroup() {
    return `
      <div class="flex w-full shrink-0 flex-col gap-[4.8cqw] pb-[1cqw]">
        ${CONSENT_CHECKBOXES.map(buildConsentCheckbox).join("")}
      </div>
    `;
  }

  // Build the continue button for the terms consent scene
  buildContinueButton() {
    return `
      <div class="flex w-full shrink-0 flex-col items-center pt-[4.8cqw] pb-[4cqw]">
        <button
          id="terms-continue-btn"
          type="button"
          disabled
          class="flex h-[10cqw] w-[40%] max-w-[200px] shrink-0 items-center justify-center rounded-[0.6cqw] border-[0.5cqw] border-white bg-transparent text-[3cqw] font-normal uppercase tracking-wide text-white opacity-40 pointer-events-none cursor-not-allowed transition-opacity enabled:active:opacity-70"
        >
          WEITER
        </button>
      </div>
    `;
  }

  // Wire the consent form to the continue button
  wireConsentForm() {
    this.checkboxes.forEach((cb) =>
      cb.addEventListener("change", () => this.syncContinueButton()),
    );
    this.btn.addEventListener("click", () => this.handleContinueClick());
    this.syncContinueButton();
  }

  // Sync the continue button state with the checkboxes
  syncContinueButton() {
    const allChecked = this.checkboxes.every((cb) => cb.checked);
    this.btn.disabled = !allChecked;
    BTN_DISABLED_CLASSES.forEach((cls) => this.btn.classList.toggle(cls, !allChecked));
  }

  // Handle the continue button click
  async handleContinueClick() {
    if (!this.checkboxes.every((cb) => cb.checked)) return;
    TermsConsentScene.saveLegalConsent();
    await this.navigateToIntroNovel();
  }

  // Navigate to the intro novel
  async navigateToIntroNovel() {
    const einstiegNovel = await this.loadEinstiegNovel();
    if (!einstiegNovel) {
      throw "Intro Novel not Found"
    };
    this.dispatchEvent(
      new CustomEvent("sm-switch-scene", {
        detail: {
          scene: "novel-scene",
          args: { novel: einstiegNovel, needBaseHeader: true },
        },
        bubbles: true,
      }),
    );
  }

  // Load the einstieg novel
  async loadEinstiegNovel() {
    try {
      const data = await fetchFromJson("assets/json/novels.json");
      return data.visualNovels.find((novel) => novel.name === "Einstieg") ?? null;
    } catch {
      return null;
    }
  }
}

customElements.define("terms-consent-scene", TermsConsentScene);
