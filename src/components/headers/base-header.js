export class BaseHeader extends HTMLElement {
  constructor() {
    super();
    // Shared styles defined once in the base class
    this.btnStyle = "background:none; border:none; padding:0; cursor:default; display:flex; outline:none;";
    this.imgStyle = "width:60px; height:60px; object-fit:contain; pointer-events:none;";
    this.clickEffect = `onmousedown="this.style.opacity='0.7'" onmouseup="this.style.opacity='1'" onmouseleave="this.style.opacity='1'"`;
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  getLeftContent() { return `<div></div>`; }

  render() {
    this.innerHTML = `
      <header style="width:1000px; background-color:#0B1A2D;">
        <div style="display:flex; align-items:flex-end; padding:120px 30px 20px 30px; width:1000px; box-sizing:border-box;">
          
          <div style="display:flex; align-items:center;">
            ${this.getLeftContent()}
          </div>

          <div style="display:flex; align-items:flex-end; gap:60px; margin-left:auto;">
            <button id="btn-legal" style="${this.btnStyle}" ${this.clickEffect}>
              <img src="assets/Images/IconsAndLogos/Icon_Legal_Small.png" style="${this.imgStyle}" />
            </button>
            <button id="btn-settings" style="${this.btnStyle}" ${this.clickEffect}>
              <img src="assets/Images/Buttons/settings.png" style="${this.imgStyle}" />
            </button>
          </div>

        </div>
      </header>`;
  }

  setupEvents() {
    const l = this.querySelector('#btn-legal'), s = this.querySelector('#btn-settings');
    if(l) l.onclick = () => console.log("Legal");
    if(s) s.onclick = () => console.log("Settings");
  }
}
customElements.define('base-header', BaseHeader);