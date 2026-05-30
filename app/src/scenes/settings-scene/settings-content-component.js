// Settings content component: audio + typography blocks (single component to keep scene wiring simple)
class SettingsContentComponent extends HTMLElement {
  connectedCallback() {
    if (this.dataset.built === "1") return;
    this.dataset.built = "1";

    // Set the content of the settings content component
    this.innerHTML = `
      <div class="mb-[3cqw] flex h-[10cqw] w-full items-center rounded-[2cqw] bg-[#F5944E] p-[1cqw] text-[4cqw] font-semibold tracking-semibold text-white">
        Audio-Optionen
      </div>

      <div class="mb-[3cqw] min-h-[40cqw] w-full rounded-[2cqw] bg-white p-[2cqw] font-semibold">
        <div class="flex h-[12cqw] w-full flex-row">
          <img draggable="false" class="h-full scale-50 object-cover" src="assets/Images/IconsAndLogos/Icon_Dialogue.png" alt="" />
          <p class="flex h-full items-center text-[5cqw] text-[#14305d]">Dialoge Vorlesen</p>
          <img draggable="false" id="voice-output-switch" class="mr-[5%] ml-auto h-full object-cover" src="assets/Images/IconsAndLogos/Icon_Settings_Inactive.png" alt="" />
        </div>
        <p class="user-font w-full font-medium tracking-wide text-[#14305d]">
          Dieser Button schaltet die Sprachausgabe in den Visual Novels an bzw. aus. Ist die Sprachausgabe aktiviert, werden die Dialoge vertont und der Text, auf welchen du drückst, wird dir vorgelesen.
        </p>
      </div>

      <div class="mb-[5cqw] min-h-[70cqw] w-full rounded-[2cqw] bg-white p-[2cqw] font-semibold">
        <div class="flex h-[12cqw] w-full flex-row">
          <img draggable="false" class="h-full scale-50 object-cover" src="assets/Images/IconsAndLogos/Icon_Soundeffect.png" alt="" />
          <p class="flex h-full items-center text-[5cqw] text-[#14305d]">Sounds aktivieren</p>
          <img draggable="false" id="sound-switch" class="mr-[5%] ml-auto h-full object-cover" src="assets/Images/IconsAndLogos/Icon_Settings_Inactive.png" alt="" />
        </div>
        <p class="user-font w-full font-medium tracking-wide text-[#14305d]">
          Hier kannst du Soundeffekte der gesammten App aktivieren und ihre Laudstärke steuern, unabhängig von der Vorleselautstärke
        </p>
        <p class="user-font w-full font-medium tracking-wide text-[#14305d]">
          Hinweis: Ist die Systemlautstärke auf 0 gestellt, oder der Stumm-Modus von iOS-Geräten aktiv, sind die Soundeffekte nicht hörbar.
        </p>

        <div class="grid h-[15cqw] w-full grid-cols-1 grid-rows-1">
          <div class="col-start-1 row-start-1 flex h-full w-full items-center">
            <img draggable="false" src="assets/Images/IconsAndLogos/Icon_Soundeffect.png" alt="Leise" class="mx-[10cqw] h-[5cqw] object-contain" />
            <div class="[container-type:inline-size] h-[5cqw] w-full">
              <input type="range" min="0" max="100" value="80" id="volume-slider" class="slider h-full w-full appearance-none" />
            </div>
            <img draggable="false" src="assets/Images/IconsAndLogos/Icon_Soundeffect.png" alt="Laut" class="mx-[10cqw] h-[10cqw] object-contain" />
          </div>
          <div id="slidebar-cover" class="pointer-events-none col-start-1 row-start-1 z-10 h-full w-full bg-white/50"></div>
        </div>
      </div>

      <div class="mb-[3cqw] flex h-[10cqw] w-full items-center rounded-[2cqw] bg-[#F5944E] p-[1cqw] text-[4cqw] font-semibold tracking-semibold text-white">
        Textdarstellung
      </div>

      <div class="mb-[5cqw] min-h-[70cqw] w-full rounded-[2cqw] bg-white p-[2cqw] font-semibold">
        <div class="flex h-[12cqw] w-full flex-row">
          <img draggable="false" class="h-full scale-50 object-cover" src="assets/Images/IconsAndLogos/Icon_Typesize.png" alt="" />
          <p class="flex h-full items-center text-[5cqw] text-[#14305d]">Schriftgröße anpassen</p>
        </div>

        <div class="flex h-[15cqw] w-full items-center">
          <div class="mx-[10cqw] flex h-[5cqw] items-center text-[5cqw]">A</div>
          <div class="[container-type:inline-size] h-[5cqw] w-full">
            <input type="range" min="0" max="100" value="50" id="fontSize-slider" class="slider h-full w-full appearance-none" />
          </div>
          <div class="mx-[10cqw] flex h-[5cqw] items-center text-[10cqw]">A</div>
        </div>

        <div id="example-text" class="mb-[3cqw] w-full text-center font-medium tracking-wide">Beispieltext</div>

        <p class="user-font mb-[3cqw] w-full font-medium tracking-wide text-[#14305d]">
          Mit dem Regler kannst du die Schriftgröße für die meisten Texte in der App anpassen. An dem Beispieltext kannst du sehen, wie groß die Texte angezeigt werden, sobald du bestätigst.
        </p>

        <div id="fontSize-button" class="user-font flex h-[9cqw] w-full items-center justify-center bg-[#132e59] font-medium text-white">
          SCHRIFTGRÖSSE FESTLEGEN
        </div>
      </div>

      <div class="pb-[3cqw] text-center text-[#14305d] text-[3cqw] text-[2cqw]">Version: 1.5.1</div>
    `;
  }
}

customElements.define("settings-content-component", SettingsContentComponent);
