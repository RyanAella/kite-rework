// Impressum page: load imprint block from legal-content.json; shell uses drag-scrolling.js on main.
import "../../shared-components/headers/back-header.js";
import "../../shared-components/footer.js";
import {
  attachLegalDragScroll,
  escapeHtml,
  legalPageShell,
  renderLegalSections,
} from "./legal-shared.js";

class ImprintScene extends HTMLElement {
  async connectedCallback() {
    let mainHtml =
      '<h1 class="mb-[4.8cqw] text-center text-[7.2cqw] font-bold tracking-tight text-[#0b1a2d]">Impressum</h1><p class="text-[3cqw] leading-[1.55] text-[#0b1a2d]">Content could not be loaded.</p>';

    // data.impressum: title + sections[]
    try {
      const res = await fetch("assets/json/legal-content.json");
      const data = await res.json();
      const block = data.impressum;
      if (block) {
        const title = escapeHtml(block.title || "Impressum");
        const body = renderLegalSections(block.sections);
        mainHtml = `<h1 class="mb-[4.8cqw] text-center text-[4.8cqw] font-bold tracking-tight text-[#213a60]">${title}</h1>${body}`;
      }
    } catch (_) {
      // keep fallback
    }

    this.innerHTML = legalPageShell(mainHtml); // no overlay on imprint
    attachLegalDragScroll(this);
  }
}

customElements.define("imprint-scene", ImprintScene);
