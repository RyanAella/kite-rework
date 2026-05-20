// Shared helpers for scrollable document-style screens (legal, about KITE, etc.):
// safe HTML, section markup, optional privacy toolbar, layout shell, drag scroll.
// Used by legal sub-scenes and terms-consent-scene (accordion bodies).

import { addDragScrolling } from "../shared-services/drag-scrolling.js";

const LEGAL_JSON_URL = "assets/json/legal-content.json";

// Variant styles for the document content
const VARIANT_STYLES = {
  document: {
    heading: (top) =>
      `mb-[3.2cqw] text-[3.6cqw] font-bold text-[#0b1a2d]${top}`,
    linesBlock: "mb-[3.2cqw] text-[3.6cqw] leading-tight text-[#0b1a2d]",
    paragraph: "mb-[2.4cqw] text-[3.6cqw] leading-tight text-[#0b1a2d]",
    link: "text-blue-700 underline break-words",
  },
  consentAccordion: {
    heading: (top) => `mb-[2cqw] text-[3cqw] font-bold text-white${top}`,
    linesBlock: "mb-[2cqw] text-[2.85cqw] leading-snug text-white/90",
    paragraph: "mb-[2cqw] text-[2.85cqw] leading-snug text-white/90",
    link: "text-sky-200 underline break-words",
  },
};

// Escape HTML characters
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Check if the href is safe
function isSafeHref(href) {
  const h = String(href || "").trim();
  return h.startsWith("https://") || h.startsWith("http://");
}

function getVariantStyles(variant) {
  return VARIANT_STYLES[variant] || VARIANT_STYLES.document;
}

// One paragraph: plain string or array of text / link segments
function renderParagraphBlock(p, variant) {
  const { paragraph: pClass, link: linkClass } = getVariantStyles(variant);
  if (typeof p === "string") {
    return `<p class="${pClass}">${escapeHtml(p)}</p>`;
  }
  if (!Array.isArray(p)) return "";

  const inner = p
    .map((seg) => {
      if (typeof seg === "string") return escapeHtml(seg);
      if (seg && seg.type === "text" && seg.text != null) return escapeHtml(seg.text);
      if (seg && seg.type === "link" && seg.text && seg.href && isSafeHref(seg.href)) {
        return `<a href="${escapeHtml(seg.href)}" class="${linkClass}" rel="noopener noreferrer">${escapeHtml(seg.text)}</a>`;
      }
      return "";
    })
    .join("");

  return `<p class="${pClass}">${inner}</p>`;
}

// Build HTML for sections (heading, optional lines, optional paragraphs).
export function renderDocumentSections(sections, options = {}) {
  const variant = options.variant === "consentAccordion" ? "consentAccordion" : "document";
  const styles = getVariantStyles(variant);
  if (!sections || !sections.length) return "";
  return sections
    .map((section, index) => {
      const top = index === 0 ? "" : variant === "consentAccordion" ? " mt-[4cqw]" : " mt-[5.6cqw]";
      const heading = section.heading
        ? `<h2 class="${styles.heading(top)}">${escapeHtml(section.heading)}</h2>`
        : "";

      let body = "";
      if (section.lines && section.lines.length) {
        body += `<p class="${styles.linesBlock}">${section.lines.map(escapeHtml).join("<br />")}</p>`;
      }
      if (section.paragraphs && section.paragraphs.length) {
        body += section.paragraphs.map((p) => renderParagraphBlock(p, variant)).join("");
      }
      return heading + body;
    })
    .join("");
}

// Build HTML for the privacy toolbar
export function renderPrivacyToolbar(toolbar) {
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

// Build the HTML for the document page shell
export function documentPageShell(mainColumnHtml) {
  return `
      <div class="relative flex h-full min-h-0 w-full flex-col overflow-hidden font-sans text-[#0b1a2d]">
        <div class="pointer-events-none absolute inset-0 bg-bright bg-cover"></div>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
        <div class="relative z-10 flex min-h-0 w-full flex-1 flex-col">
          <back-header class="w-full shrink-0"></back-header>
          <main id="document-scroll-container" class="min-h-0 flex-1 w-full overflow-x-hidden overflow-y-scroll no-scrollbar">
            <div data-document-content class="w-full text-left px-[9.6cqw] py-[4cqw] pb-[19.2cqw]">
              ${mainColumnHtml}
            </div>
          </main>
        </div>
        <div id="document-popup-container" class="pointer-events-none absolute inset-0 z-50"></div>
      </div>
    `;
}

// Attach the document page drag scroll
export function attachDocumentPageDragScroll(rootEl) {
  const scrollBox = rootEl.querySelector("#document-scroll-container");
  if (scrollBox) addDragScrolling(scrollBox);
}

// Fetch the legal content
export async function fetchLegalContent() {
  try {
    const res = await fetch(LEGAL_JSON_URL);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
