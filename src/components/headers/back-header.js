import { BaseHeader } from './base-header.js';

export class BackHeader extends BaseHeader {
  // Back arrow with "Zurück" label
  getLeftContent() {
    return `
      <button id="btn-back" style="${this.btnStyle} gap: 15px; color: white;" ${this.clickEffect}>
        <img src="assets/Images/DropDown/Arrow_Left.png" style="${this.imgStyle}" />
        <span style="font-size: 32px; font-family: sans-serif; letter-spacing: 0.025em; margin-top: 5px;">
          Zurück
        </span>
      </button>`;
  }

  setupEvents() {
    super.setupEvents();
    const b = this.querySelector('#btn-back');
    if(b) {
      // Trigger the custom "sm-back" event for the SceneManager
      b.onclick = () => this.dispatchEvent(new CustomEvent("sm-back", {
        bubbles: true, composed: true
      }));
    }
  }
}
customElements.define('back-header', BackHeader);