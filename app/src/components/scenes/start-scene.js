class StartScene extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Starting Scene loaded");

    // html body
    this.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full w-full bg-blue-ud bg-cover">
            
            <img src="assets/Images/LoadingScreen/Kite_Logo_im_Kreis.png" alt="Kite Emblem" class="pointer-events-none object-contain w-[64%] aspect-square mb-[6%]">

            <img src="assets/Images/IconsAndLogos/Logo_Kite_Lettering_White.png" alt="Kite Text" class="pointer-events-none object-contain w-[68%] h-[17%] mb-[12%]">

            <button id="start-btn" class="w-[32.4%] h-[4.6%] border-[0.5cqw] border-white text-white flex items-center justify-center rounded-[0.6cqw] mb-[8%]">
              <span class="text-[3cqw]">STARTEN</span>
            </button>
          </div>
        `;


    // event listener for the button
    const btn = this.querySelector('#start-btn'); // selecting button
    btn.addEventListener('click', async () => {
      
      const sm = document.querySelector('scene-manager');
      if (sm) {
        try {
          const response = await fetch("assets/json/novels.json");
          const data = await response.json();
          const einstiegNovel = data.visualNovels.find(novel => novel.name === "Einstieg");

          sm.dispatchEvent(new CustomEvent("sm-switch-scene", {
            detail: {
              scene: "novel-scene",
              args: {
                novel: einstiegNovel,
                needBaseHeader: true,
              }
            }
          }));
        } catch (error) {
          console.error("Error loading novels.json:", error);
        }
      } else {
        console.error("Scene Manager not found!");
      }
    });
  }
}

customElements.define("start-scene", StartScene);
