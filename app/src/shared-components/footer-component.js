// Shared Tailwind classes for buttons and icons
const enabledBtnClass = "bg-transparent flex flex-col items-center gap-[1.2cqw] outline-none transition-all duration-200 opacity-70";
// Disabled-mode press feedback: rests at 70%, dims to 40% while held.
const disabledBtnClass = "bg-transparent flex flex-col items-center gap-[1.2cqw] outline-none transition-opacity opacity-70 active:opacity-40";
const imgClass = "w-[6cqw] h-[6cqw] object-contain pointer-events-none";

export class Footer extends HTMLElement {

  connectedCallback() {
    this.render();
    this.setupEvents();

    // Disabled mode: visible footer, no navigation, no active highlight.
    if (this.isDisabled()) return;

    // Check which scene is currently active via attribute
    const currentScene = this.getAttribute('active-scene');
    this.initActiveButton(currentScene);
  }

  isDisabled() {
    return this.hasAttribute('disabled');
  }

  getButtonClass() {
    return this.isDisabled() ? disabledBtnClass : enabledBtnClass;
  }


  /**
   * Initial setup: finds the button that matches the given scene name
   * @param {String} sceneName 
   */
  initActiveButton(sceneName) {
    const targetBtn = this.querySelector(`button[data-scene="${sceneName}"]`);
    if (targetBtn) {
      this.setActive(targetBtn);
    }
  }

  /**
   * Updates the visual active state (opacity) of a button
   * @param {HTMLElement} btn 
   * @returns 
   */
  setActive(btn) {
    if (!btn) return;
    this.querySelectorAll('button').forEach(b => {
      b.classList.remove('opacity-100');
      b.classList.add('opacity-70');
    });
    btn.classList.remove('opacity-70');
    btn.classList.add('opacity-100');
  }

  /**
   * Adds all contents to the Footer Element in the DOM
   */
  render() {
    const btnClass = this.getButtonClass();
    this.classList = "w-full h-[20cqw]"
    this.innerHTML = `
      <footer class="w-full h-full bg-[#0B1A2D] flex items-center box-border border-white/10">
        <div class="flex justify-between items-center w-full px-[6cqw]">
          
          <button id="foot-start" data-scene="novel-selector-scene" class="${btnClass}">
            <img src="assets/Images/Buttons/home.png" class="${imgClass}" />
            <span class="text-white text-[2cqw] font-sans">Start</span>
          </button>

          <button id="foot-archive" data-scene="archive-scene" class="${btnClass}">
            <img src="assets/Images/Buttons/archive.png" class="${imgClass}" />
            <span class="text-white text-[2cqw] font-sans">Archiv</span>
          </button>

          <button id="foot-bookmark" data-scene="bookmarks-scene" class="${btnClass}">
            <img src="assets/Images/Buttons/bookmark.png" class="${imgClass}" />
            <span class="text-white text-[2cqw] font-sans">Gemerkt</span>
          </button>

          <button id="foot-links" data-scene="links-scene" class="${btnClass}">
            <img src="assets/Images/Buttons/weblinks.png" class="${imgClass}" />
            <span class="text-white text-[2cqw] font-sans">Links</span>
          </button>

          <button id="foot-knowledge" data-scene="knowledge-scene" class="${btnClass}">
            <img src="assets/Images/Buttons/knowledge.png" class="${imgClass}" />
            <span class="text-white text-[2cqw] font-sans">Wissen</span>
          </button>

        </div>
      </footer>`;
  }

  /**
   * Add all required Event Listeners to the Footer Elements
   */
  setupEvents() {
    // Prevent clicks from reaching elements behind the footer
    this.onclick = (e) => e.stopPropagation();
    this.onmousedown = (e) => e.stopPropagation();

    this.querySelectorAll('button').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();

        // Disabled: swallow click; press feedback is via active:opacity-40 on the button class.
        if (this.isDisabled()) return;

        const targetScene = btn.getAttribute('data-scene');
        const currentActiveScene = this.getAttribute('active-scene');

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