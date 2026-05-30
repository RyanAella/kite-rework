import "./container-component.js";

class CardOverlayComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.className = "w-full flex flex-col items-center shrink-0";
        this.cardOverlay();
    }

    // Creates the card overlay to display the full text
    cardOverlay() {
        this.detailCard = document.createElement('div');
        this.detailCard.className = "w-full bg-white p-[5cqw] rounded-[3cqw] flex flex-col gap-[4cqw]";

        this.detailTitle = document.createElement('h2');
        this.detailTitle.className = "user-font text-[#14305d] font-bold text-center";
        this.detailTitle.innerText = this.args.title;

        this.detailText = document.createElement('p');
        this.detailText.className = "user-font text-[#14305d] leading-[5cqw] whitespace-pre-wrap"; // whitespace-pre-wrap respektiert Zeilenumbrüche im Text

        if (this.args.sourceUrl) {
            // Wir suchen das Wort "(Quelle)" im Text und ersetzen es durch einen echten HTML-Link
            const formattedText = this.args.fullText.replace(
                "(Quelle)", 
                `<a href="${this.args.sourceUrl}" target="_blank" class="text-[#F5944E]">(Quelle)</a>`
            );
            
            // Wichtig: innerHTML nutzen, damit der Link als HTML interpretiert wird!
            this.detailText.innerHTML = formattedText;
        } else {
            // Fallback, falls das JSON keine URL hat
            this.detailText.innerText = this.args.fullText;
        }

        this.detailCard.appendChild(this.detailTitle);
        this.detailCard.appendChild(this.detailText);

        this.appendChild(this.detailCard);
    }
}

customElements.define("card-overlay-component", CardOverlayComponent);