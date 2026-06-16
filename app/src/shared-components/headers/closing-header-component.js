import { BaseHeader } from './base-header-component.js';

export class ClosingHeader extends BaseHeader {
  // Close / X icon
  getLeftContent() {
    return `
      <button id="btn-close" class="${this.btnClass}">
        <img src="assets/Images/Buttons/Close_2x.png" class="${this.imgClass}" />
      </button>`;
  }

  setupEvents() {
    super.setupEvents();
    const c = this.querySelector('#btn-close');
    if(c) {
      c.onclick = (event) => {
        this.dispatchEvent(new CustomEvent('sm-switch-scene', { 
          detail: { scene: "novel-selector-scene" }, bubbles: true,
        }));
        event.stopPropagation();
      }
    }
  }
}
customElements.define('closing-header', ClosingHeader);