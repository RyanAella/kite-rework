// Terms of use page: load nutzungsbedingungen from legal-content.json; shell uses drag-scrolling.js on main.
import "../../shared-components/headers/back-header.js";
import "../../shared-components/footer.js";
import {
  attachLegalDragScroll,
  escapeHtml,
  legalPageShell,
  renderLegalSections,
} from "./legal-shared.js";

class TosScene extends HTMLElement {
  async connectedCallback() {
    let mainHtml =
      '<h1 class="mb-[4.8cqw] text-center text-[3.6cqw] font-bold tracking-tight text-[#0b1a2d]">Nutzungsbedingungen</h1><p class="text-[3cqw] leading-[1.55] text-[#0b1a2d]">Content could not be loaded.</p>';

    // data.nutzungsbedingungen: title + sections[]
    try {
      const res = await fetch("assets/json/legal-content.json");
      const data = await res.json();
      const block = data.nutzungsbedingungen;
      if (block) {
        const title = escapeHtml(block.title || "Nutzungsbedingungen");
        const body = renderLegalSections(block.sections);
        mainHtml = `<h1 class="mb-[4.8cqw] text-center text-[4.8cqw] font-bold tracking-tight text-[#213a60]">${title}</h1>${body}`;
      }
    } catch (_) {
      // keep fallback
    }

    this.innerHTML = legalPageShell(mainHtml); // no overlay
    attachLegalDragScroll(this);
  }
}

customElements.define("tos-scene", TosScene);
