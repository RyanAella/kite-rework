// Datenschutz (privacy) page: JSON content; drag scroll + settings-style info popup.
import "../../shared-components/headers/back-header.js";
import "../../shared-components/footer.js";
import { attachDataprivacyInfoPopup } from "./dataprivacy-info-popup.js";
import {
  attachDocumentPageDragScroll,
  documentPageShell,
  escapeHtml,
  renderDocumentSections,
  renderPrivacyToolbar,
} from "../../shared-components/document-page-shared.js";

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
        const toolbarRow = renderPrivacyToolbar(block.toolbar);
        const body = renderDocumentSections(block.sections);
        mainHtml = `<h1 class="mb-[4.8cqw] text-center text-[4.8cqw] font-bold tracking-tight text-[#213a60]">${title}</h1>${toolbarRow}${body}`;
        toolbar = block.toolbar;
      }
    } catch (_) {
      // keep fallback
    }

    this.innerHTML = documentPageShell(mainHtml);
    attachDocumentPageDragScroll(this);
    attachDataprivacyInfoPopup(this, toolbar);
  }
}

customElements.define("dataprivacy-scene", DataprivacyScene);
