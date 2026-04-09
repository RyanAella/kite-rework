import '../headers/closing-header.js';

class NovelSelector extends HTMLElement {
    
    async connectedCallback() {

        console.log("Added New Novel Selector Component");

        let response = await fetch("assets/novels.json");
        let data = await response.json();
        this.novels = data['visualNovels'];

        // HTML for the list
        const novelItemsHtml = this.novels.map(novel => `
            <div data-id="${novel.name}" class="novel-item w-full text-center py-8 transition-colors border-b-4 border-[#0b1a2d]">
                <span class="select-none text-5xl font-semibold text-gray-900 tracking-tight">
                    ${novel.title}
                </span>
            </div>
        `).join('');

        // base structure
        this.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full w-full bg-bright bg-cover">
                <closing-header></closing-header>
                <div class="w-full h-full p-15">
                    
                    <h1 class="select-none text-5xl font-semibold text-center mt-5 mb-20 tracking-tight text-[#0b1a2d]">
                        NOVELS
                    </h1>
                    
                    ${novelItemsHtml}

                </div> 
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

customElements.define('novel-selector', NovelSelector);
