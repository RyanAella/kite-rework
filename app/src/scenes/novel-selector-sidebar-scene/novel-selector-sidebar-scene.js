import { fetchFromJson } from '../../shared-services/fetch-service.js';
import '../../shared-components/headers/closing-header-component.js';

class NovelSelectorSidebarScene extends HTMLElement {

  preventHistoryPush = true;
  
  // Static cache für novels data - wird einmal geladen und wiederverwendet
  static novelsDataCache = null;

  async connectedCallback() {

    // 1. Prüfe globalen Cache (von loading-scene pregeladen)
    if (window.novelsCache) {
      this.novels = window.novelsCache.visualNovels.filter(novel => novel.name != "Einstieg");
    }
    // 2. Prüfe statischen Cache
    else if (NovelSelectorSidebarScene.novelsDataCache) {
      this.novels = NovelSelectorSidebarScene.novelsDataCache.filter(novel => novel.name != "Einstieg");
    }
    // 3. Lade neu und speichere in beide Caches
    else {
      let data = await fetchFromJson("assets/json/novels.json");
      window.novelsCache = data;
      NovelSelectorSidebarScene.novelsDataCache = data['visualNovels'];
      this.novels = NovelSelectorSidebarScene.novelsDataCache.filter(novel => novel.name != "Einstieg");
    }

    // HTML for the list
    const novelItemsHtml = this.novels.sort((a, b) => {
      if(a.title < b.title) {
        return -1
      }
      if(b.title < a.title) {
        return 1;
      }
      return 0;
    }).map(novel => `
      <div data-id="${novel.name}" class="novel-item w-full text-center py-[1.3cqw] transition-colors border-b-[0.5cqw] border-[#0b1a2d]">
        <span class="text-[4.8cqw] font-semibold text-gray-900 tracking-tight">
          ${novel.title}
        </span>
      </div>
    `).join('');

    // base structure
    this.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full w-full bg-bright bg-cover">
        <closing-header></closing-header>
        <div class="w-full h-[160cqw] p-[6cqw]">
          
          <h1 class="text-[4.8cqw] font-semibold text-center mt-[2cqw] mb-[8cqw] tracking-tight text-[#0b1a2d]">
            NOVELS
          </h1>
          
          ${novelItemsHtml}

        </div>
        <main-footer active-scene="novel-selector-scene"></main-footer>
      </div>
    `;

    this.addEventListeners();
  }

  /**
   * Add listener for clicking on a novel.
   */
  addEventListeners() {
    const items = this.querySelectorAll('.novel-item');
    items.forEach(item => {
      item.addEventListener('click', (event) => {

        const novelId = event.currentTarget.getAttribute('data-id');

        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: {
            scene: "novel-scene",
            args: {
              novel: this.novels.find(novel => novel.name === novelId)
            }
          },
          bubbles: true
        }));
      });
    });
  }
}

customElements.define('novel-selector-sidebar-scene', NovelSelectorSidebarScene);
