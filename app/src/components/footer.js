export class Footer extends HTMLElement {
  constructor() {
    super();
    // Shared Tailwind classes for buttons and icons
    this.btnClass = "bg-transparent border-none p-0 flex flex-col items-center gap-3 outline-none transition-all duration-200 select-none opacity-70";
    this.imgClass = "w-15 h-15 object-contain pointer-events-none";
  }

  connectedCallback() {
    // Styling the custom element itself
    this.classList.add('block', 'w-full', 'max-w-[1000px]', 'h-48', 'absolute', 'bottom-0', 'left-0', 'z-50', 'pointer-events-auto');
    
    this.render();
    this.setupEvents();
    
    // Check which scene is currently active via attribute
    const currentScene = this.getAttribute('active-scene') || 'novel-selector';
    this.initActiveButton(currentScene);
  }

  // Initial setup: finds the button that matches the current scene name
  initActiveButton(sceneName) {
    const targetBtn = this.querySelector(`button[data-scene="${sceneName}"]`);
    if (targetBtn) {
      this.setActive(targetBtn);
    }
  }

  // Updates the visual active state (opacity) of the buttons
  setActive(btn) {
    if (!btn) return;
    this.querySelectorAll('button').forEach(b => {
      b.classList.remove('opacity-100');
      b.classList.add('opacity-70');
    });
    btn.classList.remove('opacity-70');
    btn.classList.add('opacity-100');
  }

  render() {
    this.innerHTML = `
      <footer class="w-full h-full bg-[#0B1A2D] flex items-center box-border border-t border-white/10">
        <div class="flex justify-between items-center w-full px-15">
          
          <button id="foot-start" data-scene="novel-selector" class="${this.btnClass}">
            <img src="assets/Images/Buttons/home.png" class="${this.imgClass}" />
            <span class="text-white text-xl font-sans">Start</span>
          </button>

          <button id="foot-archive" data-scene="archive" class="${this.btnClass}">
            <img src="assets/Images/Buttons/archive.png" class="${this.imgClass}" />
            <span class="text-white text-xl font-sans">Archiv</span>
          </button>

          <button id="foot-bookmark" data-scene="bookmarks" class="${this.btnClass}">
            <img src="assets/Images/Buttons/bookmark.png" class="${this.imgClass}" />
            <span class="text-white text-xl font-sans">Gemerkt</span>
          </button>

          <button id="foot-links" data-scene="weblinks" class="${this.btnClass}">
            <img src="assets/Images/Buttons/weblinks.png" class="${this.imgClass}" />
            <span class="text-white text-xl font-sans">Links</span>
          </button>

          <button id="foot-knowledge" data-scene="knowledge" class="${this.btnClass}">
            <img src="assets/Images/Buttons/knowledge.png" class="${this.imgClass}" />
            <span class="text-white text-xl font-sans">Wissen</span>
          </button>

        </div>
      </footer>`;
  }

  setupEvents() {
    // Prevent clicks from reaching elements behind the footer
    this.onclick = (e) => e.stopPropagation();
    this.onmousedown = (e) => e.stopPropagation();

    this.querySelectorAll('button').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();

        const targetScene = btn.getAttribute('data-scene');
        const currentActiveScene = this.getAttribute('active-scene') || 'novel-selector';

        // Check if the target scene is already the current scene
        if (targetScene === currentActiveScene) {
          console.log(`Already in scene: ${targetScene}. Action canceled.`);
          return; // Stop execution if we are already there
        }
        
        // Trigger the SceneManager switch event
        if (targetScene) {
            this.dispatchEvent(new CustomEvent('sm-switch-scene', { 
              detail: { scene: targetScene }, 
              bubbles: true,  
            }));
        }
      };
    });
  }
}

customElements.define('main-footer', Footer);