import { bindTapOnlyExternalLink } from "../../shared-services/tap-service.js";

class ListComponent extends HTMLElement {

    constructor() {
        super();
    }

    async connectedCallback() {
        await this.generateLinksSection();
    }

    async fetchLinksData() {
    let response = await fetch("assets/json/links-scene-content.json");
    let data = await response.json();
    return data;
    }

    async generateLinksSection() {
        const linksData = await this.fetchLinksData();

        // --- Container für die Link-Liste ---
        const listContainer = document.createElement('div');
        listContainer.className = "flex flex-col w-full px-[6cqw] gap-[8cqw]";

        // --- Schleife zum Generieren der Einträge ---
        linksData.forEach(item => {
            const itemContainer = document.createElement('div');
            itemContainer.className = "flex flex-col gap-[2cqw]";

            // Titel
            const itemTitle = document.createElement('h2');
            itemTitle.innerText = item.title;
            itemTitle.className = "text-[#14305d] text-[4.5cqw] font-bold";
            itemContainer.appendChild(itemTitle);

            // Beschreibung
            const itemDesc = document.createElement('p');
            itemDesc.innerText = item.desc;
            itemDesc.className = "text-[#14305d] text-[3.5cqw] leading-[5.5cqw] mb-[2cqw]";
            itemContainer.appendChild(itemDesc);

            // Klickbares Bild (Anker-Tag)
            const itemLink = document.createElement('a');
            itemLink.href = item.url;
            itemLink.target = "_blank"; // Öffnet den Link im neuen Tab/Browser
            itemLink.rel = "noopener noreferrer"; // Sicherheits-Standard für externe Links
            itemLink.className = "block w-full overflow-hidden rounded-[4cqw] shadow-lg bg-white transform transition-transform active:scale-95 aspect-[16/9] items-center justify-center";

            const itemImg = document.createElement('img');
            itemImg.src = item.imgSrc;
            itemImg.alt = `Link zu ${item.title}`;
            itemImg.className = `w-full h-full ${item.imgStyle || 'object-contain'}`;

            itemLink.appendChild(itemImg);
            bindTapOnlyExternalLink(itemLink, item.url);

            itemContainer.appendChild(itemLink);

            // Eintrag zur Liste hinzufügen
            listContainer.appendChild(itemContainer);
        });
        this.appendChild(listContainer);
    }
}

customElements.define("list-component", ListComponent);

