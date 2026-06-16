import { fetchFromJson } from "../../shared-services/fetch-service.js";
import { ImageLoadingService } from "../../shared-services/image-loading-service.js";
import { TermsConsentScene } from "../terms-consent-scene/terms-consent-scene.js";

class LoadingScene extends HTMLElement {

  async connectedCallback() {

    // html body
    this.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full w-full bg-blue-ud bg-cover">
            
            <img src="assets/Images/LoadingScreen/Kite_Logo_im_Kreis.png" alt="Kite Emblem" class="pointer-events-none object-contain w-[64%] aspect-square mb-[6%]">

            <img src="assets/Images/IconsAndLogos/Logo_Kite_Lettering_White.png" alt="Kite Text" class="pointer-events-none object-contain w-[68%] h-[17%] mb-[12%]">

            <!-- White progress track -->
            <div class="w-[80cqw] h-[3cqw] bg-white rounded-full overflow-hidden">
    
              <!-- Orange progress filler (Starts at ~8% like the image) -->
              <div 
                  id="progress-bar" 
                  class="h-full w-0 bg-[#f26522] transition-all duration-300 ease-out"
              ></div>
    
            </div>
          </div>
        `;

    this.progressBar = this.querySelector('#progress-bar');

    const progressTracker = {totalImageCount: 0, loadedCount: 0}

    const proxy = new Proxy(progressTracker, {
      set: (target, property, value) => {
        target[property] = value;
        console.debug(`Preloading Progress: ${target["loadedCount"]} / ${target["totalImageCount"]}`);
        if(target["loadedCount"] === target["totalImageCount"]) {
          this.proceedToNextScene();
        } else {
          this.progressBar.style.width = ((target["loadedCount"] * 100) / target["totalImageCount"]) + "%";
        }
        return true;
      }
    });
    
    await ImageLoadingService.loadImages(proxy);

  }

  /**
   * Proceeds to either the start-scene or terms-content-scene depending on weather the TOS has already been accepted
   */
  proceedToNextScene() {
    this.dispatchEvent(
      new CustomEvent("sm-switch-scene", {
        detail: { scene: TermsConsentScene.hasLegalConsentCached() ? "start-scene" : "terms-consent-scene"},
        bubbles: true,
      }),
    );
  }
}

customElements.define("loading-scene", LoadingScene);

