import { BaseHeader } from './base-header-component.js';

export class BackHeader extends BaseHeader {
  // Back arrow with "Zurück" label
  getLeftContent() {
    return `
      <button id="btn-back" class="${this.btnClass} gap-[1.5cqw] items-center text-white">
        <img src="assets/Images/DropDown/Arrow_Left.png" class="${this.imgClass}" />
        <span class="text-[3.2cqw] font-sans tracking-tight mt-[0.5cqw]">
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
        bubbles: true
      }));
    }
  }
}
customElements.define('back-header', BackHeader);