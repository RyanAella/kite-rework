class StartScene extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
<<<<<<< HEAD
    console.log("Starting");
    this.dispatchEvent(new CustomEvent("sm-switch-scene", {
      detail: {
        scene : "novel-selector"
      },
      bubbles : true
    }));
=======
    console.log("Starting Scene loaded");

    // html body
    this.innerHTML = `
          <div class="flex flex-col items-center justify-center min-h-screen font-sans bg-[#0d264f]">
            
            <div class="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white flex items-center justify-center shadow-2xl mb-12">
              <img src="/assets/textures/icons-and-logos/Logo_Kite.png" alt="Kite Emblem" class="object-contain w-full h-full">
            </div>

            <h1 class="text-8xl md:text-9xl font-black text-white lowercase tracking-tighter mb-16">
              kite
            </h1>

            <button id="start-btn" 
                    class="px-12 py-4 border-2 border-white bg-[#123460] text-white text-xl font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-[#0d264f] transition-all duration-300 shadow-lg cursor-pointer">
              STARTEN
            </button>

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
>>>>>>> main
  }
}

customElements.define("start-scene", StartScene);
