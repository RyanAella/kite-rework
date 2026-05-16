// Datenschutz (privacy) page: JSON content; drag scroll + shared information popup.
import "../../shared-components/headers/back-header.js";
import "../../shared-components/footer.js";
import { hideSwapModal, showSwapModal, createInformationPopup } from "../../shared-services/information-popup-service.js";
import {
  attachDocumentPageDragScroll,
  documentPageShell,
  escapeHtml,
  renderDocumentSections,
  renderPrivacyToolbar,
} from "../../shared-components/document-page-shared.js";

const DEFAULT_DATAPRIVACY_INFO_TEXT =
  "Mit diesem Button kannst du deine App zurücksetzen. Sämtliche Daten, welche durch dein Spielen entstanden sind, werden gelöscht.";

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
    this.attachToolbarInfoPopup(toolbar);
  }

  attachToolbarInfoPopup(toolbar) {
    if (!toolbar) return;

    const popup = createInformationPopup(
      String(toolbar.infoText || DEFAULT_DATAPRIVACY_INFO_TEXT),
    );

    const popupContainer = this.querySelector("#document-popup-container");
    if (!popupContainer) return;

    popup.addEventListener("information-popup-close", () => {
      hideSwapModal(popupContainer);
    });

    const openBtn = this.querySelector("[data-info-open]");
    if (openBtn) {
      openBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showSwapModal(popupContainer, popup);
      });
    }
  }
}

customElements.define("dataprivacy-scene", DataprivacyScene);
