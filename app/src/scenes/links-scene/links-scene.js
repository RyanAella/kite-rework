import "../../shared-components/headers/back-header-component.js";
import "../../shared-components/footer-component.js";
import { addDragScrolling } from "../../shared-services/drag-scrolling-service.js";
import "./list-component.js";

class LinksScene extends HTMLElement {

  async connectedCallback() {
    this.className = "flex flex-col w-full h-full bg-bright font-sans overflow-hidden";

    const header = document.createElement("back-header");
    this.appendChild(header);

    // 3. Scrollable Content-Section
    const scrollContainer = document.createElement('div');
    scrollContainer.id = "scroll-container";
    scrollContainer.className = "flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center w-full pb-[10cqw] no-scrollbar";

    // --- Top Section (Icon & Title) ---
    const topSection = document.createElement('div');
    topSection.className = "flex flex-col items-center justify-center mt-[8cqw] mb-[10cqw] px-[6cqw]";

    const globeIcon = document.createElement('img');
    globeIcon.src = "assets/Images/IconsAndLogos/Icon_Linklist.png";
    globeIcon.className = "w-[25cqw] max-w-[120px] mb-[4cqw] object-contain";

    const mainTitle = document.createElement('h1');
    mainTitle.innerText = "WEITERFÜHRENDE LINKS";
    mainTitle.className = "text-[#14305d] text-[4.5cqw] font-extrabold tracking-wide text-center uppercase";

    topSection.appendChild(globeIcon);
    topSection.appendChild(mainTitle);
    scrollContainer.appendChild(topSection);

    const listComponent = document.createElement("list-component");
    scrollContainer.appendChild(listComponent);
    this.appendChild(scrollContainer);

    addDragScrolling(this.querySelector("#scroll-container"));

    const footer = document.createElement("main-footer");
    footer.setAttribute("active-scene", "links-scene");
    this.appendChild(footer);
  }
}

customElements.define("links-scene", LinksScene);