import { BaseHeader } from './base-header.js';

export class ClosingHeader extends BaseHeader {
  // Close / X icon
  getLeftContent() {
    return `
      <button id="btn-close" style="${this.btnStyle}" ${this.clickEffect}>
        <img src="assets/Images/Buttons/Close_2x.png" style="${this.imgStyle}" />
      </button>`;
  }

  setupEvents() {
    super.setupEvents();
    const c = this.querySelector('#btn-close');
    if(c) {
      c.onclick = () => this.dispatchEvent(new CustomEvent('sm-switch-scene', { 
        detail: { scene: "start-scene" }, bubbles: true, composed: true 
      }));
    }
  }
}
customElements.define('closing-header', ClosingHeader);