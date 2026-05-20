import {
  escapeHtml,
  renderDocumentSections,
} from "../../shared-components/document-page-shared.js";

// The sections for the About Kite content component
const ABOUT_KITE_SECTIONS = [
  {
    heading: "Was ist KITE?",
    paragraphs: [
      "KITE ist eine gamifizierte Web-App. Du erlebst typische Situationen im Gründungsprozess – z. B. Bankgespräch oder Raumanmietung – und trainierst Reflexion, Handlungskompetenz und Resilienz im Umgang mit Bias.",
    ],
  },
  {
    heading: "Für wen ist KITE gedacht?",
    paragraphs: [
      "KITE richtet sich an Gründerinnen, an Menschen, die mit Gründerinnen arbeiten – z. B. Investor*innen, Berater*innen, Journalist*innen, Vermietende – sowie an Interessierte, die durch Perspektivenübernahme lernen möchten.",
    ],
  },
  {
    heading: "Wozu dient KITE?",
    paragraphs: [
      "Die App hilft dir, Diskriminierung in Gründungssituationen zu erkennen, souverän zu reagieren und Resilienz aufzubauen. Ziel ist nicht, dass du dich „anpasst“, sondern dass diskriminierende Muster sichtbar und benennbar werden und du deine Optionen reflektieren kannst.",
    ],
  },
  {
    heading: "Wie funktionieren die Visual Novels?",
    paragraphs: [
      "Du spielst realistische, von wahren Begebenheiten inspirierte Dialoge. Eine Visual Novel ist eine interaktive Erzählform aus Text und Bildern. Du triffst Dialogentscheidungen und bestimmst den Verlauf. Du schlüpfst in die Rolle einer Gründerin und erlebst ihre Herausforderungen.",
    ],
  },
  {
    heading: "Wie funktioniert das KI-Feedback?",
    paragraphs: [
      "Nach jedem Dialog erhältst du ein KI-basiertes Feedback. Die KI analysiert die Gespräche, weist auf Vorurteile hin (z. B. Zweifel an Müttern, Technik-Stereotype) und zeigt Strategien mit Vor- und Nachteilen auf. Eine Übersicht und Erklärung der verschiedenen Biases findest du in der Wissensbasis.",
    ],
  },
  {
    heading: "Wie kannst du deinen Fortschritt verfolgen?",
    paragraphs: [
      "Im Archiv findest du gespielte Dialoge und Analysen. Du kannst dir Novels merken, sie erneut spielen und sehen, welche Entscheidungen du schon ausprobiert hast.",
    ],
  },
  {
    heading: "Wer hat KITE entwickelt?",
    paragraphs: [
      "KITE wurde an der Hochschule Heilbronn im Lab für Sozioinformatik von einem Team unter Leitung von Prof. Dr. Nicola Marsden entwickelt. Die bundesweite gründerinnenagentur (bga) ist zentrale Partnerin für die App. Gefördert wurde die Entwicklung durch das Bundesministerium für Bildung, Familie, Senioren, Frauen und Jugend (BMBFSFJ) im Rahmen der Förderrichtlinie „Künstliche Intelligenz für das Gemeinwohl“.",
    ],
  },
  {
    heading: "Wie kann ich starten?",
    paragraphs: [
      "Gehe zur Novel-Auswahl. Wähle eine Visual Novel und tauche in die Geschichte ein. Erlebe hautnah, was es bedeutet, gegen Diskriminierung anzutreten.",
    ],
  },
  {
    heading: "Wie kann ich mehr erfahren?",
    paragraphs: [
      "Wenn du zunächst noch mehr über KITE erfahren möchtest, spiele die Einstiegs-Novel.",
    ],
  },
];

// Build the HTML for the hexagon
function buildAboutKiteHexHtml(novel) {
  const fill = novel.novelColor ?? "#aa1c02";
  const stroke = novel.novelFrameColor ?? "#d04c03";
  const title = escapeHtml(novel.title ?? "Mehr zu KITE");
  return `
    <div class="relative mx-auto flex h-[26.6cqw] w-[29.6cqw] items-center justify-center">
      <svg viewBox="0 0 296 266" class="absolute inset-0 z-0 h-full w-full overflow-visible">
        <path
          d="M 96.5,0 L 209.5,0 Q 229.5,0 239.5,17.3 L 296,115.7 Q 306,133 296,150.3 L 239.5,248.7 Q 229.5,266 209.5,266 L 96.5,266 Q 76.5,266 66.5,248.7 L 10,150.3 Q 0,133 10,115.7 L 66.5,17.3 Q 76.5,0 96.5,0 Z"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="12"
        />
      </svg>
      <div class="relative z-10 w-[80%] select-none pointer-events-none text-center text-[3.6cqw] font-semibold text-white">
        ${title}
      </div>
    </div>
  `;
}

// Build the HTML for the content component
export function buildAboutKiteContentComponent(einstiegNovel) {
  return `
    <div class="flex w-full justify-center pb-[4cqw] pt-[4cqw]">
      ${buildAboutKiteHexHtml(einstiegNovel)}
    </div>
    <p class="mb-[3.2cqw] text-[3.6cqw] font-semibold text-[#0b1a2d]">
      KITE - kurz erklärt
    </p>
    ${renderDocumentSections(ABOUT_KITE_SECTIONS)}
    <div class="mt-[8cqw] flex w-full max-w-full flex-col items-center gap-[3.2cqw]">
      <button type="button" data-about-nav="novel-selector"
        class="w-[62cqw] max-w-full rounded border-[0.1cqw] border-transparent bg-[#0B1A2D] px-[1.8cqw] py-[3.2cqw] text-center text-[3.2cqw] font-bold uppercase tracking-wider text-white transition-opacity active:opacity-80">
        ZUR NOVEL-AUSWAHL
      </button>
      <button type="button" data-about-nav="einstieg"
        class="w-[62cqw] max-w-full rounded border-[0.1cqw] border-[#0B1A2D] bg-transparent px-[1.8cqw] py-[3.2cqw] text-center text-[3.2cqw] font-bold uppercase tracking-wider text-[#0B1A2D] transition-opacity active:opacity-80">
        ZUR EINSTIEGSNOVEL
      </button>
      <button type="button" data-about-nav="knowledge"
        class="w-[62cqw] max-w-full rounded border-[0.1cqw] border-[#0B1A2D] bg-transparent px-[1.8cqw] py-[3.2cqw] text-center text-[3.2cqw] font-bold uppercase tracking-wider text-[#0B1A2D] transition-opacity active:opacity-80">
        ZUR WISSENSBASIS
      </button>
    </div>
  `;
}

// Wire the about kite content navigation
export function wireAboutKiteContentNavigation(hostEl, einstiegNovel) {
  hostEl.querySelector('[data-about-nav="novel-selector"]')?.addEventListener(
    "click",
    () => {
      hostEl.dispatchEvent(
        new CustomEvent("sm-switch-scene", {
          detail: { scene: "novel-selector" },
          bubbles: true,
          composed: true,
        }),
      );
    },
  );

  // Wire the einstieg button
  hostEl.querySelector('[data-about-nav="einstieg"]')?.addEventListener(
    "click",
    () => {
      hostEl.dispatchEvent(
        new CustomEvent("sm-switch-scene", {
          detail: {
            scene: "novel-scene",
            args: { novel: einstiegNovel, needBaseHeader: false},
          },
          bubbles: true,
          composed: true,
        }),
      );
    },
  );

  // Wire the knowledge button
  hostEl.querySelector('[data-about-nav="knowledge"]')?.addEventListener(
    "click",
    () => {
      hostEl.dispatchEvent(
        new CustomEvent("sm-switch-scene", {
          detail: { scene: "knowledge-scene" },
          bubbles: true,
          composed: true,
        }),
      );
    },
  );
}
