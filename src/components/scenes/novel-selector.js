class NovelSelector extends HTMLElement {
    
    async connectedCallback() {

        console.log("Added New Novel Selector Component");

        let response = await fetch("assets/novels.json");
        let data = await response.json();
        this.novels = data['visualNovels'];

        // HTML for the list
        const novelItemsHtml = this.novels.map(novel => `
            <div data-id="${novel.name}" 
                 class="novel-item group w-full text-center py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-black last:border-b-0">
                <span class="text-xl font-medium text-gray-900 group-hover:text-blue-600 tracking-tight">
                    ${novel.title}
                </span>
            </div>
        `).join('');

        // base structure
        this.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-screen bg-blue-50/30 font-sans">
                <div class="w-full max-w-md bg-white/80 p-6 rounded-sm shadow-sm">
                    
                    <h1 class="text-2xl font-bold text-center mb-8 tracking-[0.2em] text-slate-800">
                        NOVELS
                    </h1>
                    
                    <div class="border-t border-black">
                        ${novelItemsHtml}
                    </div>

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
