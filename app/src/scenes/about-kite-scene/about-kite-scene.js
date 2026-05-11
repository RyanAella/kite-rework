import "../../shared-components/headers/back-header.js";
import {
  attachDocumentPageDragScroll,
  documentPageShell,
} from "../../shared-components/document-page-shared.js";
import {
  buildAboutKiteContentComponent,
  wireAboutKiteContentNavigation,
} from "./content-component.js";

export class AboutKiteScene extends HTMLElement {

  // Fetch the Einstieg Novel
  async fetchEinstiegNovel() {
    const defaultEinstieg = {
      title: "Mehr zu KITE",
      novelColor: "#aa1c02",
      novelFrameColor: "#d04c03",
      name: "Einstieg",
    };

    // Load the Einstieg Novel
    let novel = { ...defaultEinstieg };
    try {
      const res = await fetch("assets/json/novels.json");
      const data = await res.json();
      const found = data.visualNovels?.find((n) => n.name === "Einstieg");
      if (found) novel = found;
    } catch {
      /* keep default */
    }
    return novel;
  }

  // Initialize the About Kite Scene
  async connectedCallback() {
    this.classList.add(
      "flex",
      "h-full",
      "w-full",
      "min-h-0",
      "flex-col",
      "overflow-hidden",
    );

    // Fetch the Einstieg Novel and initialize the content component
    const einstiegNovel = await this.fetchEinstiegNovel();
    this.innerHTML = documentPageShell(
      buildAboutKiteContentComponent(einstiegNovel),
    );
    attachDocumentPageDragScroll(this);
    wireAboutKiteContentNavigation(this, einstiegNovel);
  }
}

customElements.define("about-kite-scene", AboutKiteScene);
