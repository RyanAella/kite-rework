class SearchbarComponent extends HTMLElement {
    
    constructor() {
        super();
    }

    connectedCallback() {
        this.className = "w-full"
        this.data = this.args;
        this.cardElements = this.data.cards;
        this.categoryElements = this.data.categories;
        this.buildSearchBar();
    }

    buildSearchBar() {
        const searchContainer = document.createElement('div');
        searchContainer.className = "w-full relative flex items-center mb-[6cqw]";

        this.searchInput = document.createElement('input');
        this.searchInput.type = "text";
        this.searchInput.placeholder = "SUCHE";
        this.searchInput.className = "w-full bg-white text-[#14305d] text-[3.5cqw] p-[2cqw] rounded-[2cqw] outline-none placeholder-gray-400";

        // Clear Button (Das rote X) - Initial versteckt
        this.clearBtn = document.createElement('button');
        this.clearBtn.innerHTML = "✕"; // Einfaches Unicode-X
        this.clearBtn.className = "absolute right-[4cqw] text-red-500 text-[4cqw] hidden outline-none";
        
        // Event Listener für die Eingabe (Echtzeit-Suche)
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            this.clearBtn.classList.toggle('hidden', query.length === 0);
            console.log("Input text " + query);
            console.log("Categories: " + this.categoryElements);
            this.handleSearch(query);
        });

        // Event Listener für das X
        this.clearBtn.addEventListener('click', () => {
            this.searchInput.value = "";
            this.clearBtn.classList.add('hidden');
            this.handleSearch(""); // Suche zurücksetzen
        });

        searchContainer.appendChild(this.searchInput);
        searchContainer.appendChild(this.clearBtn);

        this.appendChild(searchContainer);
    }

    handleSearch(query) {
        if (query === "") {
            // Normalmodus: Alle Kategorien anzeigen, Karten verstecken, wenn Kategorie zu war
            this.categoryElements.forEach(cat => {
                cat.classList.remove('hidden');
                cat.classList.add('flex');
            });
            // Setzt die Karten in den ursprünglichen DOM-Baum zurück
            this.cardElements.forEach(cardObj => {
                cardObj.cardsWrapper.appendChild(cardObj.domElement);
                cardObj.domElement.classList.remove('hidden');
            });
        } else {
            // Suchmodus: Kategorien ausblenden, nur passende Karten flach anzeigen
            this.categoryElements.forEach(cat => {
                cat.classList.add('hidden');
                cat.classList.remove('flex');
            });

            const listContainer = this.categoryElements[0].parentElement;

            this.cardElements.forEach(cardObj => {
                if (cardObj.searchText.includes(query)) {
                    cardObj.domElement.classList.remove('hidden');
                    // Hängt die passende Karte temporär direkt in den Haupt-Container, 
                    listContainer.appendChild(cardObj.domElement);
                } else {
                    cardObj.domElement.classList.add('hidden');
                }
            });
        }
    }
}

customElements.define("searchbar-component", SearchbarComponent);