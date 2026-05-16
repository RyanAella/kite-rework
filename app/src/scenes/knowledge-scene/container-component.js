import { addDragScrolling } from "../../shared-services/drag-scrolling.js";

export class ContainerComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.className = "flex flex-col w-full h-full bg-bright font-sans overflow-hidden relative";

        // 1. Der Main-Header
        const header = document.createElement("back-header");
        header.addEventListener('sm-back', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetScene = "novel-selector";
            this.dispatchEvent(new CustomEvent("sm-switch-scene", {
                detail: { 
                    scene : targetScene,
                },
                bubbles : true
            }));
        });
        this.appendChild(header);

        // 2. Der Haupt-Scrollbereich (Master-View)
        this.mainScrollContainer = document.createElement('div');
        this.mainScrollContainer.id = "main-scroll-container";
        this.mainScrollContainer.className = "relative flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center w-full pb-[10cqw] px-[6cqw] no-scrollbar";
        addDragScrolling(this.mainScrollContainer);


        this.buildTopSection();

        this.appendChild(this.mainScrollContainer);

        const footer = document.createElement("main-footer");
        footer.setAttribute("active-scene", "knowledge-scene");
        this.appendChild(footer);
    }

    buildTopSection() {
        const topSection = document.createElement('div');
        topSection.className = "flex flex-col items-center justify-center mt-[8cqw] w-full";

        const bulbIcon = document.createElement('img');
        bulbIcon.src = "assets/Images/IconsAndLogos/Icon_Knowledge.png"; 
        bulbIcon.className = "w-[25cqw] max-w-[140px] mb-[2cqw] object-contain";

        const mainTitle = document.createElement('h1');
        mainTitle.innerText = "WISSEN";
        mainTitle.className = "text-[#14305d] text-[5cqw] font-bold tracking-wide text-center uppercase mb-[5cqw]";

        topSection.appendChild(bulbIcon);
        topSection.appendChild(mainTitle);
        this.mainScrollContainer.appendChild(topSection);
    }

}

customElements.define("container-component", ContainerComponent);