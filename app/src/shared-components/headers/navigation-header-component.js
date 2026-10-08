import { BaseHeader } from './base-header-component.js';
import { uiAsset } from "../ui-asset-service.js";

export class NavigationHeader extends BaseHeader {
  // Hamburger menu icon
  getLeftContent() {
    return `
      <button id="btn-nav" class="${this.btnClass}">
        <img src="${uiAsset('button.burgerMenu')}" class="${this.imgClass}"/>
      </button>`;
  }

  setupEvents() {
    super.setupEvents();
    const n = this.querySelector('#btn-nav');
    if(n) {
      n.onclick = (event) => {
        this.dispatchEvent(new CustomEvent('sm-switch-scene', { 
          detail: { scene: "novel-selector-sidebar-scene" }, bubbles: true
        }));
        event.stopPropagation();
      };
    }
  }
}
customElements.define('navigation-header', NavigationHeader);