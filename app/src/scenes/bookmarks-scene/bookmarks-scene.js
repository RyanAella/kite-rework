import "../../shared-components/headers/back-header.js";
import "../../shared-components/footer.js";
import { bookmarkedNovelStore } from "../../shared-services/store-service.js";
import { initHoneycombComponent } from "./honeycomb-component.js";

class BookmarksScene extends HTMLElement {

  // Fetch the bookmarked selectable novels
  async fetchBookmarkedSelectableNovels() {
    const response = await fetch("assets/json/novels.json");
    const data = await response.json();
    const allNovels = data["visualNovels"];
    const selectableNovels = allNovels.filter((n) => n.name !== "Einstieg");
    const validNames = selectableNovels.map((n) => n.name);

    const bookmarkedNames = bookmarkedNovelStore.load(validNames);
    return selectableNovels.filter((n) => bookmarkedNames.has(n.name));
  }

  async connectedCallback() {
    console.log("Bookmarks Scene loaded");

    this.innerHTML = `
      <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden font-sans text-[#0b1a2d]">
        <div class="pointer-events-none absolute inset-0 bg-bright bg-cover"></div>

        <div class="relative z-10 flex min-h-0 w-full flex-1 flex-col">
          <back-header class="w-full shrink-0"></back-header>

          <div class="min-h-0 flex-1 w-full overflow-y-auto no-scrollbar overflow-x-hidden">
            <div class="flex w-full flex-col items-center gap-[3.2cqw] px-[6cqw] py-[3.6cqw] pb-[24cqw]">

              <div class="flex w-full flex-col items-center gap-[1.6cqw]">
                <img
                  src="assets/Images/IconsAndLogos/Icon_Favorites.png"
                  alt=""
                  class="w-[25.6cqw] aspect-square object-contain pointer-events-none select-none"
                />
                <h1 class="select-none text-center text-[4.8cqw] font-bold tracking-tight text-[#284673]">
                  GEMERKTE NOVELS
                </h1>
              </div>

              <div id="hex-grid" class="mt-[4cqw] flex w-full justify-center overflow-visible"></div>

            </div>
          </div>

          <main-footer active-scene="bookmarks-scene"></main-footer>
        </div>
      </div>
    `;

    // Fetch the bookmarked selectable novels and initialize the honeycomb component
    const novelsToShow = await this.fetchBookmarkedSelectableNovels();
    initHoneycombComponent(this, novelsToShow);
  }
}

customElements.define("bookmarks-scene", BookmarksScene);
