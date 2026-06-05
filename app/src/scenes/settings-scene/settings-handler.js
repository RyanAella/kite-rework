import { loadAppSettings, saveAppSettings } from "../../shared-services/app-settings-session-service.js";
import { playAudio } from "../../shared-services/audio-playing-service.js";
import { hidePinnedModal, showPinnedModal } from "../../shared-services/information-popup-service.js";
import { applyUserFontSize, fontSizeToCqw } from "../../shared-services/user-font-size-service.js";

// Settings handler class to manage the settings UI and persistence
export class SettingsHandler {
  settings;

  constructor(refs) {
    this.refs = refs;
    this.settings = loadAppSettings();
  }

  // Attach event listeners to the settings UI
  attachListeners() {
    const { refs } = this;

    refs.popup.addEventListener("information-popup-close", () => this.hidePopup());

    refs.voiceOutputSwitch.addEventListener("click", () => {
      this.settings.voiceOutput = !this.settings.voiceOutput;
      this.persistAndRefresh();
      refs.popup.setInformationText(
        this.settings.voiceOutput
          ? "Text wird dir nun Vorgelesen"
          : "Text wird dir nun nicht länger Vorgelesen",
      );
      this.showPopup();
    });

    // Set the sounds switch listener
    refs.soundsSwitch.addEventListener("click", () => {
      this.settings.soundsActive = !this.settings.soundsActive;
      this.persistAndRefresh();
      refs.popup.setInformationText(
        this.settings.soundsActive
          ? "Sämtliche Soundeffekte der App wurden aktiviert. Dies ist unabhängig von der Vorlesefunktion."
          : "Sämtliche Soundeffekte der App wurden deaktiviert. Dies ist unabhängig von der Vorlesefunktion.",
      );
      this.showPopup();
    });

    let volumeStore = false;
    // Set the volume slider listener
    refs.volumeSlider.oninput = () => {
      this.settings.soundVolume = refs.volumeSlider.value;
      volumeStore = true;
      this.persistAndRefresh();
    };

    window.addEventListener("mouseup", (event) => {
      if(volumeStore) {
        playAudio("SFX_InteractionButton_2");
        volumeStore = false;
      }
    });

    // Set the font size slider listener
    refs.fontSizeSlider.oninput = () => {
      refs.exampleTextEl.style = `font-size: ${fontSizeToCqw(refs.fontSizeSlider.value)}cqw`;
    };

    // Set the font size button listener
    refs.fontSizeButton.addEventListener("click", () => {
      this.settings.fontSize = refs.fontSizeSlider.value;
      this.persistAndRefresh();
      applyUserFontSize();
      refs.popup.setInformationText("Die Schriftgröße wurde angepasst");
      this.showPopup();
    });
  }

  // Show the settings popup
  showPopup() {
    showPinnedModal(this.refs.popupContainer, this.refs.popup);
  }

  // Hide the settings popup
  hidePopup() {
    hidePinnedModal(this.refs.popupContainer, this.refs.popup);
  }

  // Persist the settings and refresh the UI
  persistAndRefresh() {
    saveAppSettings(this.settings);
    this.applyControlChrome();
  }

  // Apply the control chrome to the UI
  applyControlChrome() {
    const { refs } = this;
    refs.voiceOutputSwitch.src = `assets/Images/IconsAndLogos/Icon_Settings_${this.settings.voiceOutput ? "Active" : "Inactive"}.png`;
    refs.soundsSwitch.src = `assets/Images/IconsAndLogos/Icon_Settings_${this.settings.soundsActive ? "Active" : "Inactive"}.png`;
    refs.fontSizeSlider.value = String(this.settings.fontSize);
    if (this.settings.soundsActive) {
      refs.slidebarCover.classList.remove("bg-white/50");
      refs.slidebarCover.classList.add("pointer-events-none");
      refs.volumeSlider.value = String(this.settings.soundVolume);
    } else {
      refs.slidebarCover.classList.add("bg-white/50");
      refs.slidebarCover.classList.remove("pointer-events-none");
      refs.volumeSlider.value = "0";
    }
  }

  // Sync the example font from the slider
  syncExampleFontFromSlider() {
    const { refs } = this;
    refs.exampleTextEl.style = `font-size: ${fontSizeToCqw(refs.fontSizeSlider.value)}cqw`;
  }
}

