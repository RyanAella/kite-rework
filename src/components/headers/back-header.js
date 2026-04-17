import { BaseHeader } from './base-header.js';

export class BackHeader extends BaseHeader {
  // Back arrow with "Zurück" label
  getLeftContent() {
    return `
      <button id="btn-back" class="${this.btnClass} gap-[15px] items-center text-white">
        <img src="assets/Images/DropDown/Arrow_Left.png" class="${this.imgClass}" />
        <span class="text-[32px] font-sans tracking-tight mt-[5px]">
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