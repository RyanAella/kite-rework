class StartScene extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Starting Scene loaded");

    // html body
    this.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full w-full bg-blue-ud bg-cover">
            
            <img src="assets/Images/LoadingScreen/Kite_Logo_im_Kreis.png" alt="Kite Emblem" class="pointer-events-none select-none object-contain w-160 h-160 mb-15">

            <img src="assets/Images/IconsAndLogos/Logo_Kite_Lettering_White.png" alt="Kite Text" class="pointer-events-none select-none object-contain w-170 h-85 mb-30">

            <button id="start-btn" class="w-81 h-23 border-5 border-white text-white text-3xl rounded-md mb-20"> STARTEN
          </div>
        `;


    // event listener for the button
    const btn = this.querySelector('#start-btn'); // selecting button
    btn.addEventListener('click', () => {
      
      const sm = document.querySelector('scene-manager');
      if (sm) {
        sm.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: {
            scene: "novel-selector"
          }
        }));
      } else {
        console.error("Scene Manager not found!");
      }
    });
  }
}

customElements.define("start-scene", StartScene);
