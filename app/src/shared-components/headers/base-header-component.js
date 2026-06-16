export class BaseHeader extends HTMLElement {
  
  btnClass = "bg-transparent flex outline-none transition-opacity active:opacity-70";
  imgClass = "w-[6cqw] h-[6cqw] object-contain pointer-events-none";

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  // Placeholder for specific content (to be overridden by subclasses)
  getLeftContent() { return `<div class="w-0"></div>`; }

  /**
   * Adds all contents to the Header Element in the DOM
   */
  render() {
    this.classList.add("w-full", "h-[20cqw]");
    this.innerHTML = `
      <header class="w-full h-full bg-[#0B1A2D]">
        <div class="flex items-end pt-[11cqw] px-[3cqw] pb-[2cqw] w-full box-border">
          
          <div class="flex items-center">
            ${this.getLeftContent()}
          </div>

          <div class="flex items-end gap-[6cqw] ml-auto">
            <button id="btn-legal" class="${this.btnClass}">
              <img src="assets/Images/IconsAndLogos/Icon_Legal_Small.png" class="${this.imgClass}" />
            </button>
            <button id="btn-settings" class="${this.btnClass}">
              <img src="assets/Images/Buttons/settings.png" class="${this.imgClass}" />
            </button>
          </div>

        </div>
      </header>`;
  }

  /**
   * Add all required Event Listeners to the Header Elements
   */
  setupEvents() {
    const header = this.querySelector('header');
    const l = this.querySelector('#btn-legal');
    const s = this.querySelector('#btn-settings');

    // prevents scrolling while clicking on the header background
    if (header) {
      header.onclick = (e) => e.stopPropagation();
      header.onmousedown = (e) => e.stopPropagation();
    }

    if (l) {
      l.onclick = (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: { scene: "legal-information-scene" },
          bubbles: true
        }));
      };
    }
    
    if(s) s.onclick = (e) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('sm-switch-scene', { 
        detail: { scene: "settings-scene" }, 
        bubbles: true
      }));
    };
  }
}
customElements.define('base-header', BaseHeader);