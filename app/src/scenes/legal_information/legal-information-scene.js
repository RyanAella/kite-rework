import "../../shared-components/headers/back-header.js";
import "../../shared-components/footer.js";
import { isNovelSessionActive } from "../../shared-services/novel-session-service.js";

// Legal hub: entry point with links to Impressum, Datenschutz, Nutzungsbedingungen; footer inside z-10 column like settings.

class LegalInformationScene extends HTMLElement {
  connectedCallback() {
    // Disable footer nav if arriving from a running novel.
    const footerAttrs = isNovelSessionActive() ? "disabled" : "";

    // Static layout + footer; buttons dispatch sm-switch-scene for the router
    this.innerHTML = `
      <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden font-sans text-[#0b1a2d]">
        <div class="pointer-events-none absolute inset-0 bg-bright bg-cover"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>

        <div class="relative z-10 flex min-h-0 w-full flex-1 flex-col">
          <back-header class="w-full shrink-0"></back-header>

          <div class="min-h-0 flex-1 w-full overflow-y-auto no-scrollbar">
            <div class="flex w-full flex-col items-center gap-[3.2cqw] px-[9.6cqw] py-[3.6cqw] pb-[19.2cqw]">

              <div class="flex w-full flex-col items-center gap-[1.6cqw]">
                <img
                  src="assets/Images/IconsAndLogos/Icon_Legal_Big.png"
                  alt=""
                  class="w-[25.6cqw] aspect-square object-contain pointer-events-none select-none"
                />
                <h1 class="select-none text-center text-[4.8cqw] font-bold tracking-tight text-[#284673]">
                  Rechtliche Informationen
                </h1>
              </div>

              <div class="flex w-full flex-col gap-[1.6cqw] rounded-[1.6cqw] border-[0.1cqw] border-gray-100 bg-white p-[3.2cqw] shadow-sm mb-[8cqw] mt-[8cqw]">
                <div class="flex min-h-[20cqw] w-full items-center justify-center overflow-hidden rounded-[1.2cqw] bg-white">
                  <img
                    src="assets/Images/IconsAndLogos/Logo_Sponsor.png"
                    class="max-h-[48cqw] w-full object-contain pointer-events-none select-none"
                  />
                </div>
              </div>

              <div class="flex w-full flex-col gap-[4cqw]">
                <button id="btn-impressum" type="button" class="user-font w-fullselect-none border-0 bg-[#142b52] py-[3.2cqw] text-center font-bold uppercase tracking-wide text-white shadow-sm transition-opacity active:opacity-70">
                  Impressum
                </button>
                <button id="btn-datenschutz" type="button" class="user-font w-full select-none border-0 bg-[#142b52] py-[3.2cqw] text-center font-bold uppercase tracking-wide text-white shadow-sm transition-opacity active:opacity-70">
                  Datenschutz
                </button>
                <button id="btn-nutzung" type="button" class="user-font w-full select-none border-0 bg-[#142b52] py-[3.2cqw] text-center font-bold uppercase tracking-wide text-white shadow-sm transition-opacity active:opacity-70">
                  Nutzungsbedingungen
                </button>
              </div>

              <div class="w-full select-none pb-[0.8cqw] text-center text-[3cqw] font-medium text-[#0b1a2d]/70">
                Version: 1.5.1
              </div>

            </div>
          </div>

          <main-footer ${footerAttrs}></main-footer>
        </div>
      </div>
    `;

    this.setupEvents();
  }

  setupEvents() {
    // Bubble composed sm-switch-scene so the app shell can change the active scene
    const btnImpressum = this.querySelector("#btn-impressum");
    const btnDatenschutz = this.querySelector("#btn-datenschutz");
    const btnNutzung = this.querySelector("#btn-nutzung");

    const dispatchSwitch = (sceneName) => {
      this.dispatchEvent(
        new CustomEvent("sm-switch-scene", {
          detail: { scene: sceneName },
          bubbles: true,
          composed: true,
        })
      );
    };

    if (btnImpressum) btnImpressum.onclick = () => dispatchSwitch("imprint-scene");
    if (btnDatenschutz) btnDatenschutz.onclick = () => dispatchSwitch("dataprivacy-scene");
    if (btnNutzung) btnNutzung.onclick = () => dispatchSwitch("tos-scene");
  }
}

customElements.define("legal-information-scene", LegalInformationScene);
