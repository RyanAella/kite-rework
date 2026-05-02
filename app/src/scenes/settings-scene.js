import { addDragScrolling } from "../services/drag-scrolling.js";

class SettingsScene extends HTMLElement{

  voiceOutputSwitch;
  soundsSwitch;

  settings = {};

  constructor() {
    super();
    if(sessionStorage.getItem("settings") == null) {
      sessionStorage.setItem("settings", JSON.stringify({
        "voiceOutput" : true,
        "soundsActive" : true,
        "soundVolume" : 70,
        "typeSize" : 70
      }));
    }
    this.settings = JSON.parse(sessionStorage.getItem("settings"));
  }

  connectedCallback() {

    console.log("Settings Scene loaded");
    this.innerHTML = `
          <div class="h-full w-full grid grid-rows-1 grid-cols-1">
            <div class="col-start-1 row-start-1 flex flex-col items-center justify-center h-full w-full bg-bright bg-cover">
              <back-header></back-header>
              <div id="scroll-container" class="flex flex-col items-center overflow-x-hidden overflow-y-scroll no-scrollbar h-[80%] w-full px-[5%]">
              
                <img draggable=false class="h-[30cqw] object-cover" src="assets/Images/IconsAndLogos/Icon_Settings.png"/>

                <p class="font-semibold w-full text-center text-[5cqw] text-[#14305d] tracking-semibold mb-[5%]">
                  EINSTELLUNGEN
                </p>

                <div class="w-full h-[10cqw] bg-[#F5944E] rounded-[2cqw] p-[1cqw] font-semibold mb-[3cqw] flex items-center text-[4cqw] text-white text-white tracking-semibold">
                  Audio-Optionen
                </div>

                <div class="w-full h-[40cqw] bg-white rounded-[2cqw] p-[2cqw] font-semibold mb-[3cqw]">
                  <div class="w-full h-[12cqw] flex flex-row">
                    <img draggable=false class="h-full object-cover scale-50" src="assets/Images/IconsAndLogos/Icon_Dialogue.png"/>
                    <p class="h-full flex items-center text-[#14305d] text-[5cqw]">Dialoge Vorlesen</p>
                    <img draggable=false id="voice-output-switch" class="h-full object-cover ml-auto mr-[5%]" src="assets/Images/IconsAndLogos/Icon_Settings_Inactive.png"/>
                  </div>
                  <p class="w-full text-[#14305d] text-[3cqw] font-medium tracking-wide">
                    Dieser Button schaltet die Sprachausgabe in den Visual Novels an bzw. aus. Ist die Sprachausgabe aktiviert, werden die Dialoge vertont und der Text, auf welchen du drückst, wird dir vorgelesen.
                  </p>
                </div>
                
                <div class="w-full h-[70cqw] bg-white rounded-[2cqw] p-[2cqw] font-semibold mb-[5cqw]">
                  <div class="w-full h-[12cqw] flex flex-row">
                    <img draggable=false class="h-full object-cover scale-50" src="assets/Images/IconsAndLogos/Icon_Soundeffect.png"/>
                    <p class="h-full flex items-center text-[#14305d] text-[5cqw]">Sounds aktivieren</p>
                    <img draggable=false id="sound-switch" class="h-full object-cover ml-auto mr-[5%]" src="assets/Images/IconsAndLogos/Icon_Settings_Inactive.png"/>
                  </div>
                  <p class="w-full text-[#14305d] text-[3cqw] font-medium tracking-wide">
                    Hier kannst du Soundeffekte der gesammten App aktivieren und ihre Laudstärke steuern, unabhängig von der Vorleselautstärke
                  </p>
                  <p class="w-full text-[#14305d] text-[3cqw] font-medium tracking-wide">
                    Hinweis: Ist die Systemlautstärke auf 0 gestellt, oder der Stumm-Modus von iOS-Geräten aktiv, sind die Soundeffekte nicht hörbar.
                  </p>

                  <div class="w-full h-[15cqw] grid grid-rows-1 grid-cols-1">
                    <div class="col-start-1 row-start-1 w-full h-full flex items-center">
                      <!-- Linkes Bild (klein) -->
                      <img 
                        draggable=false
                        src="assets/Images/IconsAndLogos/Icon_Soundeffect.png" 
                        alt="Leise" 
                        class="h-[5cqw] object-contain mx-[10cqw]"
                      />

                      <!-- Das Elternelement definiert den Container-Typ -->
                      <div class="[container-type:inline-size] w-full h-[5cqw]">
                        
                        <input 
                          type="range"
                          min="0" 
                          max="100" 
                          value="80"
                          id="volume-slider"
                          class="w-full h-full appearance-none slider"
                        >
                      </div>

                      <!-- Rechtes Bild (groß) -->
                      <img 
                        draggable=false
                        src="assets/Images/IconsAndLogos/Icon_Soundeffect.png" 
                        alt="Laut" 
                        class="h-[10cqw] object-contain mx-[10cqw]"
                      />
                    </div>

                    <div id="slidebar-cover" class="col-start-1 row-start-1 w-full h-full z-10 bg-white/50 pointer-events-none"></div>

                  </div>
                </div>

                <div class="w-full h-[10cqw] bg-[#F5944E] rounded-[2cqw] p-[1cqw] font-semibold mb-[3cqw] flex items-center text-[4cqw] text-white text-white tracking-semibold">
                  Textdarstellung
                </div>
                
                <div class="w-full h-[70cqw] bg-white rounded-[2cqw] p-[2cqw] font-semibold mb-[5cqw]">
                  <div class="w-full h-[12cqw] flex flex-row">
                    <img draggable=false class="h-full object-cover scale-50" src="assets/Images/IconsAndLogos/Icon_Typesize.png"/>
                    <p class="h-full flex items-center text-[#14305d] text-[5cqw]">Schriftgröße anpassen</p>
                  </div>

                  <div class="w-full h-[15cqw] flex items-center">
                  
                    <div class="h-[5cqw] mx-[10cqw] text-[5cqw] flex items-center">A</div>

                    <div class="[container-type:inline-size] w-full h-[5cqw]">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value="80"
                        id="typeSize-slider"
                        class="w-full h-full appearance-none slider"
                      >
                    </div>
                    
                    <div class="h-[5cqw] mx-[10cqw] text-[10cqw] flex items-center">A</div>

                  </div>

                  <div 
                    id="example-text"
                    class="w-full text-center tracking-wide font-medium mb-[3cqw]"
                    >Beispieltext</div>
                  
                  <p class="w-full text-[#14305d] text-[3cqw] font-medium tracking-wide mb-[3cqw]">
                    Mit dem Regler kannst du die Schriftgröße für die meisten Texte in der App anpassen. An dem Beispieltext kannst du sehen, wie groß die Texte angezeigt werden, sobald du bestätigst.
                  </p>

                  <div id="typeSize-button" class="font-medium w-full h-[9cqw] bg-[#132e59] flex items-center justify-center text-[3cqw] text-white ">
                    SCHRIFTGRÖSSE FESTLEGEN
                  </div>

                </div>

                <div class="text-center text-[#14305d] text-[3cqw] text-[2cqw] pb-[3cqw]">Version: 1.5.1</div>

              </div>
              <main-footer></main-footer>
            </div>
            <div id=popup-container class="col-start-1 row-start-1 w-full h-full z-10 pointer-events-none">
            </div>
          </div>
      `;
    
    this.popup = document.createElement("div");
    this.popup.classList = "col-start-1 row-start-1 w-full h-full bg-white/50 flex items-center justify-center"
    this.popup.innerHTML = `
      <div class="w-[85cqw] h-[43cqw] rounded-[2cqw] bg-[#132034] flex flex-col items-center">
        <div class="w-[80cqw] text-white text-[5cqw] text-center p-[2cqw] border-b-[0.5cqw] mb-[5cqw]">INFORMATION</div>
        <p id="popup-information-text" class="w-[80cqw] h-[40cqw] text-white text-[3cqw]"></p>
        <div id="popup-button" class="w-[30cqw] h-[20cqw] border-[0.2cqw] flex items-center justify-center text-[3cqw] text-white mb-[5cqw]">OK</div>
      </div>
    `;

    this.voiceOutputSwitch = this.querySelector("#voice-output-switch");
    this.soundsSwitch = this.querySelector("#sound-switch");
    this.volumeSlider = this.querySelector("#volume-slider");
    this.typeSizeSlider = this.querySelector("#typeSize-slider");
    this.slidebarCover = this.querySelector("#slidebar-cover");

    this.voiceOutputSwitch.src = "assets/Images/IconsAndLogos/Icon_Settings_Inactive.png";
    this.soundsSwitch.src = "assets/Images/IconsAndLogos/Icon_Settings_Active.png";
    
    this.setupListeners();
    addDragScrolling(this.querySelector("#scroll-container"));

    this.updateStyling();
    this.querySelector("#example-text").style = `font-size: ${3+this.typeSizeSlider.value/50}cqw;`;
  
  }

  setupListeners() {
    this.popup.querySelector("#popup-button").addEventListener("click", (event) => {
      this.hidePopup();
    });
    this.voiceOutputSwitch.addEventListener("click", (event) => {
      this.settings["voiceOutput"] = !this.settings["voiceOutput"];
      this.storeSettings();
      this.setPopupText(this.settings["voiceOutput"] ? "Text wird dir nun Vorgelesen" : "Text wird dir nun nicht länger Vorgelesen");
      this.showPopup();
    });
    this.soundsSwitch.addEventListener("click", (event) => {
      this.settings["soundsActive"] = !this.settings["soundsActive"];
      this.storeSettings();
      this.setPopupText(this.settings["voiceOutput"] ? "Sämtliche Soundeffekte der App wurden aktiviert. Dies ist unabhängig von der Vorlesefunktion." : "Sämtliche Soundeffekte der App wurden deaktiviert. Dies ist unabhängig von der Vorlesefunktion.");
      this.showPopup();
    });

    this.volumeSlider.oninput = () => {
      this.settings["soundVolume"] = this.volumeSlider.value;
      this.storeSettings();
    };
    this.typeSizeSlider.oninput = () => {
    this.querySelector("#example-text").style = `font-size: ${3+this.typeSizeSlider.value/50}cqw;`;
    };

    this.querySelector("#typeSize-button").addEventListener("click", (event) => {
      this.settings["typeSize"] = this.typeSizeSlider.value;
      this.storeSettings();
      this.setPopupText("Die Schriftgröße wurde angepasst");
      this.showPopup();
    })
  }

  setPopupText(message) {
    this.popup.querySelector("#popup-information-text").innerHTML = message;
  }

  showPopup() {
    let popupContainer = this.querySelector("#popup-container");
    popupContainer.replaceChildren(this.popup);
    popupContainer.classList.remove("pointer-events-none");
  }

  hidePopup() {
    let popupContainer = this.querySelector("#popup-container");
    popupContainer.replaceChildren();
    popupContainer.classList.add("pointer-events-none");
  }

  storeSettings() {
    sessionStorage.setItem("settings", JSON.stringify(this.settings));
    this.updateStyling();
  }

  updateStyling() {
    this.voiceOutputSwitch.src = `assets/Images/IconsAndLogos/Icon_Settings_${this.settings['voiceOutput'] ? "Active" : "Inactive"}.png`
    this.soundsSwitch.src = `assets/Images/IconsAndLogos/Icon_Settings_${this.settings['soundsActive'] ? "Active" : "Inactive"}.png`
    this.typeSizeSlider.value = this.settings["typeSize"];
    console.log(this.querySelector("#example-text"));
    if(this.settings["soundsActive"]) {
      this.slidebarCover.classList.remove("bg-white/50");
      this.slidebarCover.classList.add("pointer-events-none");
    this.volumeSlider.value = this.settings["soundVolume"];
    } else {
      this.slidebarCover.classList.add("bg-white/50");
      this.slidebarCover.classList.remove("pointer-events-none");
    this.volumeSlider.value = 0;
    }
  }
}

customElements.define("settings-scene", SettingsScene);