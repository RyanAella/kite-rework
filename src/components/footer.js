export class Footer extends HTMLElement {
  constructor() {
    super();
    // shared styles for icons
    this.btnStyle = "background:none; border:none; padding:0; cursor:default; display:flex; flex-direction:column; align-items:center; gap:12px; outline:none; transition: opacity 0.1s;";
    this.imgStyle = "width:60px; height:60px; object-fit:contain; pointer-events:none;";
    this.clickEffect = `onmousedown="this.style.opacity='0.7'" onmouseup="this.style.opacity='1'" onmouseleave="this.style.opacity='1'"`;
  }

  connectedCallback() {
    Object.assign(this.style, {
      display: 'block',
      width: '1000px',
      position: 'absolute',
      bottom: '0',
      left: '0',
      zIndex: '50',
    });
    this.render();
    this.setupEvents();
  }

  render() {
    this.innerHTML = `
      <footer style="width:1000px; height: 250px; background-color:#0B1A2D; display:flex; align-items:center; box-sizing:border-box;">
        <div style="display:flex; justify-content:space-around; align-items:center; width:100%; padding: 0 50px;">
          
          <button id="foot-start" style="${this.btnStyle}" ${this.clickEffect}>
            <img src="assets/Images/Icons/Icon_Start.png" style="${this.imgStyle}" />
            <span style="color:white; font-size:22px; font-family:sans-serif;">Start</span>
          </button>

          <button id="foot-archive" style="${this.btnStyle}" ${this.clickEffect}>
            <img src="assets/Images/Icons/Icon_Archiv.png" style="${this.imgStyle}" />
            <span style="color:white; font-size:22px; font-family:sans-serif;">Archiv</span>
          </button>

          <button id="foot-bookmark" style="${this.btnStyle}" ${this.clickEffect}>
            <img src="assets/Images/Icons/Icon_Gemerkt.png" style="${this.imgStyle}" />
            <span style="color:white; font-size:22px; font-family:sans-serif;">Gemerkt</span>
          </button>

          <button id="foot-links" style="${this.btnStyle}" ${this.clickEffect}>
            <img src="assets/Images/Icons/Icon_Links.png" style="${this.imgStyle}" />
            <span style="color:white; font-size:22px; font-family:sans-serif;">Links</span>
          </button>

          <button id="foot-wissen" style="${this.btnStyle}" ${this.clickEffect}>
            <img src="assets/Images/Icons/Icon_Wissen.png" style="${this.imgStyle}" />
            <span style="color:white; font-size:22px; font-family:sans-serif;">Wissen</span>
          </button>

        </div>
      </footer>
    `;
  }

  setupEvents() {
    this.querySelector('#foot-start').onclick = () => console.log("Nav to Start");
    this.querySelector('#foot-archive').onclick = () => console.log("Nav to Archive");
    this.querySelector('#foot-bookmark').onclick = () => console.log("Nav to Bookmark");
    this.querySelector('#foot-links').onclick = () => console.log("Nav to Links");
    this.querySelector('#foot-wissen').onclick = () => console.log("Nav to Wissen");
  }
}

customElements.define('main-footer', Footer);