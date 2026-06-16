class SearchbarComponent extends HTMLElement {

  connectedCallback() {
    this.className = "w-full"
    this.data = this.args;
    this.cardElements = this.data.cards;
    this.categoryElements = this.data.categories;
    this.buildSearchBar();
  }

  /**
   * Builds the DOM Contents of the search bar
   */
  buildSearchBar() {
    const searchContainer = document.createElement('div');
    searchContainer.className = "w-full relative flex items-center mb-[6cqw]";

    this.searchInput = document.createElement('input');
    this.searchInput.type = "text";
    this.searchInput.placeholder = "SUCHE";
    this.searchInput.className = "w-full bg-white text-[#14305d] text-[3.5cqw] p-[2cqw] rounded-[2cqw] outline-none placeholder-gray-400";

    // Clear Button (red X) - Initially hidden
    this.clearBtn = document.createElement('button');
    this.clearBtn.innerHTML = "✕"; // Simple Unicode-X
    this.clearBtn.className = "absolute right-[4cqw] text-red-500 text-[4cqw] hidden outline-none";
    
    // Event Listener for Input-Handling (Real-Time-Search)
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      this.clearBtn.classList.toggle('hidden', query.length === 0);
      this.handleSearch(query);
    });

    // Event Listener for the X
    this.clearBtn.addEventListener('click', () => {
      this.searchInput.value = "";
      this.clearBtn.classList.add('hidden');
      this.handleSearch("");
    });

    searchContainer.appendChild(this.searchInput);
    searchContainer.appendChild(this.clearBtn);

    this.appendChild(searchContainer);
  }

  /**
   * Manages the display of the accordion component
   * @param {*} query The Text in the search bar
   */
  handleSearch(query) {
    if (query === "") {
      // Default Mode: All Cathegories are shown, cards are hidden, if the cathegory is collapsed
      this.categoryElements.forEach(cat => {
        cat.classList.remove('hidden');
        cat.classList.add('flex');
      });
      this.cardElements.forEach(cardObj => {
        cardObj.cardsWrapper.appendChild(cardObj.domElement);
        cardObj.domElement.classList.remove('hidden');
      });
    } else {
      // Searching Mode: Cathegories are hidden, only matching cards are shown
      this.categoryElements.forEach(cat => {
        cat.classList.add('hidden');
        cat.classList.remove('flex');
      });

      const listContainer = this.categoryElements[0].parentElement;

      this.cardElements.forEach(cardObj => {
        if (cardObj.searchText.includes(query)) {
          cardObj.domElement.classList.remove('hidden');
          listContainer.appendChild(cardObj.domElement);
        } else {
          cardObj.domElement.classList.add('hidden');
        }
      });
    }
  }
}

customElements.define("searchbar-component", SearchbarComponent);