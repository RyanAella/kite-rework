import "../../shared-components/headers/back-header.js";
import "../../shared-components/footer.js";
import { addDragScrolling } from "../../shared-services/drag-scrolling.js";
import { ensureSettingsDefaults } from "../../shared-services/app-settings-session-service.js";
import { isNovelSessionActive } from "../../shared-services/novel-session-service.js";
import { SettingsHandler } from "./settings-handler.js";
import "./settings-content-component.js";

class SettingsScene extends HTMLElement {
  connectedCallback() {
    console.log("Settings Scene loaded");
    ensureSettingsDefaults();

    // Disable footer nav if arriving from a running novel.
    const footerAttrs = isNovelSessionActive() ? "disabled" : "";

    this.innerHTML = `
      <div class="grid h-full w-full grid-cols-1 grid-rows-1">
        <div class="col-start-1 row-start-1 flex h-full w-full flex-col items-center justify-center bg-bright bg-cover">
          <back-header></back-header>
          <div id="scroll-container" class="no-scrollbar flex h-[80%] w-full flex-col items-center overflow-x-hidden overflow-y-scroll px-[5%]">
            <img draggable="false" class="h-[30cqw] object-cover" src="assets/Images/IconsAndLogos/Icon_Settings.png" alt="" />
            <p class="mb-[5%] w-full text-center text-[5cqw] font-semibold tracking-semibold text-[#14305d]">
              EINSTELLUNGEN
            </p>
          </div>
          <main-footer ${footerAttrs}></main-footer>
        </div>
        <div id="popup-container" class="pointer-events-none col-start-1 row-start-1 z-10 h-full w-full"></div>
      </div>
    `;

    // Create the settings content component
    const scrollContainer = this.querySelector("#scroll-container");
    scrollContainer.appendChild(document.createElement("settings-content-component"));
    const content = scrollContainer.querySelector("settings-content-component");

    // Create the settings popup component
    this.popup = document.createElement("information-popup-component");
    const popupContainer = this.querySelector("#popup-container");
    popupContainer.appendChild(this.popup);
    this.popup.classList.add("hidden");

    // Create the settings handler
    this.handler = new SettingsHandler({
      popup: this.popup,
      popupContainer,
      voiceOutputSwitch: content.querySelector("#voice-output-switch"),
      soundsSwitch: content.querySelector("#sound-switch"),
      volumeSlider: content.querySelector("#volume-slider"),
      slidebarCover: content.querySelector("#slidebar-cover"),
      fontSizeSlider: content.querySelector("#fontSize-slider"),
      exampleTextEl: content.querySelector("#example-text"),
      fontSizeButton: content.querySelector("#fontSize-button"),
    });

    // Attach event listeners to the settings handler
    this.handler.attachListeners();
    addDragScrolling(scrollContainer);

    this.handler.applyControlChrome();
    this.handler.syncExampleFontFromSlider();
  }
}

customElements.define("settings-scene", SettingsScene);
