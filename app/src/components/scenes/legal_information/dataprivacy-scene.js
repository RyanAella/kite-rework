// Datenschutz (privacy) page: JSON content; drag scroll + settings-style info popup.
import "../../headers/back-header.js";
import "../../footer.js";
import { attachDataprivacyInfoPopup } from "./dataprivacy-info-popup.js";
import {
  attachLegalDragScroll,
  escapeHtml,
  legalPageShell,
  renderDataprivacyToolbar,
  renderLegalSections,
} from "./legal-shared.js";

class DataprivacyScene extends HTMLElement {
  async connectedCallback() {
    // Fallback HTML if fetch fails or block missing
    let mainHtml =
      '<h1 class="mb-[4.8cqw] text-center text-[4.8cqw] font-bold tracking-tight text-[#0b1a2d]">Datenschutz</h1><p class="text-[3cqw] leading-[1.55] text-[#0b1a2d]">Content could not be loaded.</p>';

    let toolbar = null;
    // data.datenschutz: title, toolbar (reset + info), sections[]
    try {
      const res = await fetch("assets/json/legal-content.json");
      const data = await res.json();
      const block = data.datenschutz;
      if (block) {
        const title = escapeHtml(block.title || "Datenschutz");
        const toolbarRow = renderDataprivacyToolbar(block.toolbar);
        const body = renderLegalSections(block.sections);
        mainHtml = `<h1 class="mb-[4.8cqw] text-center text-[4.8cqw] font-bold tracking-tight text-[#213a60]">${title}</h1>${toolbarRow}${body}`;
        toolbar = block.toolbar;
      }
    } catch (_) {
      // keep fallback
    }

    this.innerHTML = legalPageShell(mainHtml);
    attachLegalDragScroll(this);
    attachDataprivacyInfoPopup(this, toolbar);
  }
}

customElements.define("dataprivacy-scene", DataprivacyScene);
