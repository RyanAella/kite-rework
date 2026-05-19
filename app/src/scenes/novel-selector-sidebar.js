import { fetchFromJson } from '../shared-services/fetch-service.js';
import '../shared-components/headers/closing-header.js';

class NovelSelectorSidebar extends HTMLElement {
    
    async connectedCallback() {

        console.log("Added New Novel Selector Component");
        let data = await fetchFromJson("assets/json/novels.json");
        this.novels = data['visualNovels'].filter(novel => novel.name != "Einstieg");

        // HTML for the list
        const novelItemsHtml = this.novels.map(novel => `
            <div data-id="${novel.name}" class="novel-item w-full text-center py-[3.2cqw] transition-colors border-b-[0.5cqw] border-[#0b1a2d]">
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
                <main-footer active-scene="novel-selector"></main-footer>
            </div>
        `;

        this.addEventListeners();
    }

    // listener for clicking on a novel
    addEventListeners() {
        const items = this.querySelectorAll('.novel-item');
        items.forEach(item => {
            item.addEventListener('click', (event) => {

                // just for log info (for now)
                const novelId = event.currentTarget.getAttribute('data-id');
                console.log(`Novel clicked: ${novelId}`);
                
                // switching to a scene
                this.dispatchEvent(new CustomEvent("sm-switch-scene", {
                    detail: { 
                        scene: "novel-scene",
                        args: {
                            novel: this.novels.find(novel => novel.name === novelId)
                        }
                    },
                    bubbles: true,
                    composed: true  
                }));
            });
        });
    }
}

customElements.define('novel-selector-sidebar', NovelSelectorSidebar);
