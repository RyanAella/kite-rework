export class BaseHeader extends HTMLElement {
  constructor() {
    super();
    // Shared Tailwind classes for buttons and images
    this.btnClass = "bg-transparent border-none p-0 cursor-default flex outline-none transition-opacity active:opacity-70 select-none";
    this.imgClass = "w-15 h-15 object-contain pointer-events-none";
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  // Placeholder for specific content (to be overridden by subclasses)
  getLeftContent() { return `<div class="w-1"></div>`; }

  render() {
    this.innerHTML = `
      <header class="w-[1000px] bg-[#0B1A2D]">
        <div class="flex items-end pt-[120px] px-[30px] pb-[20px] w-full box-border">
          
          <div class="flex items-center">
            ${this.getLeftContent()}
          </div>

          <div class="flex items-end gap-[60px] ml-auto">
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

  setupEvents() {
    const header = this.querySelector('header');
    const l = this.querySelector('#btn-legal');
    const s = this.querySelector('#btn-settings');

    // prevents scrolling while clicking on the header background
    if (header) {
      header.onclick = (e) => e.stopPropagation();
      header.onmousedown = (e) => e.stopPropagation();
    }

    if(l) l.onclick = (e) => {
      e.stopPropagation(); 
      console.log("Legal");
    };
    
    if(s) s.onclick = (e) => {
      e.stopPropagation(); 
      console.log("Settings");
    };
  }
}
customElements.define('base-header', BaseHeader);