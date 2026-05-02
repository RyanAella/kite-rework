// Shared helpers for legal sub-pages: safe HTML from JSON, layout shell, Datenschutz toolbar, drag scroll.

import { addDragScrolling } from "../../services/drag-scrolling.js";

// Link styling inside rendered legal paragraphs
const MAIN_LINK_CLASS = "text-blue-700 underline break-words";

// Escape text for safe insertion into HTML
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Only allow http(s) links in mixed text+link paragraphs
function isSafeHref(href) {
  const h = String(href || "").trim();
  return h.startsWith("https://") || h.startsWith("http://");
}

// One paragraph: plain string or array of text / link segments
function renderParagraphBlock(p) {
  if (typeof p === "string") {
    return `<p class="mb-[2.4cqw] text-[3.6cqw] leading-tight text-[#0b1a2d]">${escapeHtml(p)}</p>`;
  }
  if (!Array.isArray(p)) return "";
  
  const inner = p
    .map((seg) => {
      if (typeof seg === "string") return escapeHtml(seg);
      if (seg && seg.type === "text" && seg.text != null) return escapeHtml(seg.text);
      if (seg && seg.type === "link" && seg.text && seg.href && isSafeHref(seg.href)) {
        return `<a href="${escapeHtml(seg.href)}" class="${MAIN_LINK_CLASS}" rel="noopener noreferrer">${escapeHtml(seg.text)}</a>`;
      }
      return "";
    })
    .join("");
    
  return `<p class="mb-[2.4cqw] text-[3.6cqw] leading-tight text-[#0b1a2d]">${inner}</p>`;
}

// Build HTML for all sections (heading, optional lines, optional paragraphs)
export function renderLegalSections(sections) {
  if (!sections || !sections.length) return "";
  return sections
    .map((section, index) => {
      const top = index === 0 ? "" : " mt-[5.6cqw]";
      const heading = section.heading
        ? `<h2 class="mb-[3.2cqw] text-[3.6cqw] font-bold text-[#0b1a2d]${top}">${escapeHtml(section.heading)}</h2>`
        : "";
      
      let body = "";
      if (section.lines && section.lines.length) {
        body += `<p class="mb-[3.2cqw] text-[3.6cqw] leading-tight text-[#0b1a2d]">${section.lines.map(escapeHtml).join("<br />")}</p>`;
      }
      if (section.paragraphs && section.paragraphs.length) {
        body += section.paragraphs.map(renderParagraphBlock).join("");
      }
      return heading + body;
    })
    .join("");
}

// Datenschutz-only row: reset label (visual) + info button (opens popup)
export function renderDataprivacyToolbar(toolbar) {
  if (!toolbar || !toolbar.resetLabel) return "";
  return `
    <div class="mb-[6cqw] mt-[6cqw] flex w-full flex-row items-center justify-between">
      <div class="h-[6cqw] w-[6cqw] shrink-0"></div>
      
      <button type="button" tabindex="-1" class="cursor-default select-none rounded border-[0.1cqw] border-[#0b1a2d] bg-transparent px-[4cqw] py-[3.2cqw] text-center text-[2.4cqw] font-bold uppercase tracking-wider text-[#0b1a2d]">
        ${escapeHtml(toolbar.resetLabel)}
      </button>

      <button type="button" data-info-open aria-label="Info" class="flex shrink-0 cursor-pointer items-center justify-center transition-opacity active:opacity-70">
        <img src="assets/Images/Buttons/Info_Circle.png" alt="" class="h-[6cqw] w-[6cqw] object-contain pointer-events-none select-none" />
      </button>
    </div>
  `;
}

// Outer layout: backgrounds, back header, scroll column, empty popup host (see dataprivacy-info-popup.js)
export function legalPageShell(mainColumnHtml) {
  return `
      <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden font-sans text-[#0b1a2d]">
        <div class="pointer-events-none absolute inset-0 bg-bright bg-cover"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
        <div class="relative z-10 flex min-h-0 w-full flex-1 flex-col">
          <back-header class="w-full shrink-0"></back-header>
          <main id="legal-scroll-container" class="min-h-0 flex-1 w-full overflow-x-hidden overflow-y-scroll no-scrollbar">
            <div data-legal-content class="w-full text-left px-[9.6cqw] py-[4cqw] pb-[19.2cqw]">
              ${mainColumnHtml}
            </div>
          </main>
        </div>
        <div id="legal-popup-container" class="pointer-events-none absolute inset-0 z-50"></div>
      </div>
    `;
}

/** Mouse drag-to-scroll on the legal main column (same helper as settings-scene). */
export function attachLegalDragScroll(rootEl) {
  const scrollBox = rootEl.querySelector("#legal-scroll-container");
  if (scrollBox) addDragScrolling(scrollBox);
}
