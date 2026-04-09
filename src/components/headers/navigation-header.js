import { BaseHeader } from './base-header.js';

export class NavigationHeader extends BaseHeader {
  // Hamburger menu icon
  getLeftContent() {
    return `
      <button id="btn-nav" style="${this.btnStyle}" ${this.clickEffect}>
        <img src="assets/Images/Buttons/burger_menu_4x.png" style="${this.imgStyle}"/>
      </button>`;
  }

  setupEvents() {
    super.setupEvents();
    const n = this.querySelector('#btn-nav');
    if(n) {
      n.onclick = () => this.dispatchEvent(new CustomEvent('sm-switch-scene', { 
        detail: { scene: "novel-selector" }, bubbles: true, composed: true 
      }));
    }
  }
}
customElements.define('navigation-header', NavigationHeader);