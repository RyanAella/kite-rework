import { DetailHeading } from "./detail-heading-component.js";
import { escapeHtml } from "../../../../shared-services/shared-document-page-service.js";

const heading_size = 4.5;

export class DateHeading extends HTMLElement {

  static create(novelData, instanceData) {
    const element = document.createElement("date-heading");
    element.novelData = novelData;
    element.instanceData = instanceData;
    element.load();
    return element;
  }

  /**
   * Generate all subcontents of this element
   */
  load() {
    this.hex = this.novelData['novelColor']
    this.formatDate();
    this.classList = "flex flex-col w-full mt-[1cqw]";
    this.innerHTML = `
      <div 
        id="date-heading"
        class="w-full h-[${2*heading_size}cqw] flex flex-row items-center justify-center p-4 text-center text-white text-[3.5cqw]"
        style="
          background-color: ${this.novelData['novelColor']};
          clip-path: polygon(0cqw ${heading_size}cqw, ${heading_size}cqw 0cqw, ${90 - heading_size}cqw 0cqw, 90cqw ${heading_size}cqw, ${90 - heading_size}cqw ${2*heading_size}cqw, ${heading_size}cqw ${2* heading_size}cqw);
        "
      >
        <span class="ml-[3cqw]">${this.formattedDate}</span>
        <img id="arrow-img" src="assets/Images/DropDown/Arrow_Left.png" class="w-[6cqw] h-[6cqw] mr-[4cqw] ml-auto"/>
      </div>
      <div id="content-container" class="flex flex-col"></div>
    `;
    this.contentContainer = this.querySelector('#content-container');
    this.dateHeading = this.querySelector('#date-heading');
    this.arrowImg = this.querySelector('#arrow-img');

    this.dateHeading.addEventListener("click", () => {
      if(this.contentContainer.childNodes.length === 0) {
        this.arrowImg.src = "assets/Images/DropDown/Arrow_Down.png";
        this.contentContainer.replaceChildren(
            DetailHeading.create(this.novelData, "Dialog", this.createDialog(), "Der Dialog wurde in die Zwischenablage kopiert"), 
            DetailHeading.create(this.novelData, "KI-Feedback", this.createFeedback(), "Das Feedback wurde in die Zwischenablage kopiert")
        );
      } else {
        this.arrowImg.src = "assets/Images/DropDown/Arrow_Left.png";
        this.contentContainer.replaceChildren();
      }
    });
  }

  /**
   * Gets the current date, formats it correctly and saves it in this.formattedDate
   */
  formatDate() {
    const date = new Date(this.instanceData['date']);

    // 1. Get the short weekday in German (e.g., "Sa")
    const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'short' }).format(date);

    // 2. Get the date component (e.g., "16.05.2026")
    const dateStr = new Intl.DateTimeFormat('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);

    // 3. Get the time component (e.g., "10:24")
    const timeStr = new Intl.DateTimeFormat('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    }).format(date);

    // 4. Combine them with the pipe character
    const customFormat = `${weekday} | ${dateStr} | ${timeStr}`;

    this.formattedDate = customFormat; // Output: Sa | 16.05.2026 | 10:24
  }

  nameMap = {
    1 : "Du",
    2 : "Intro",
    4 : "Info",
    5 : "Journalistin",
    6 : "Vermieter",
    7 : "Vater",
    8 : "Mutter",
    9 : "Investor",
    10 : "Notarin",
    11 : "Sachbearbeiter",
    12 : "Kundin"
  }

  /**
   * Creates the contents of the dialog as html code
   * @returns The inner HTML displayed to the user in the dialog subsection as a string
   */
  createDialog() {
    let htmlElement = "";

    let currentEvent = this.novelData.novelEvents[0];
    let playerChoices = structuredClone(this.instanceData.dialog);
    let currentChoices = [];
    while(true) {

      // Managing the case, that the playing of the novel has been aborted at this point
      if (this.instanceData.isPremature && currentEvent.id === this.instanceData.lastEventId) {
        
        if (currentEvent.eventType === 4) {
            htmlElement += `<p><b>${this.nameMap[currentEvent["character"]]}:</b> ${currentEvent["text"]}</p>`;
        } else if (currentEvent.eventType === 16) {
            htmlElement += `<p><i><b>Hinweis:</b> ${currentEvent["relevantBias"]}</i></p>`;
        }
        htmlElement += `<p>Das Gespräch wurde vorzeitig beendet.</p>`;
        
        return htmlElement;
      }

      switch (currentEvent.eventType){
        case 2:
        case 11:
          currentEvent = this.novelData.novelEvents.find((element) => element.id == currentEvent.nextId);
          break;
        case 4:
          htmlElement += `<p><b>${this.nameMap[currentEvent["character"]]}:</b> ${currentEvent["text"]}</p>`
          currentEvent = this.novelData.novelEvents.find((element) => element.id == currentEvent.nextId);
          break;
        case 5:
          currentChoices.push(currentEvent);
          currentEvent = this.novelData.novelEvents.find((element) => element.id == currentEvent.nextId);
          break;
        case 6:
          let choice = currentChoices[playerChoices.shift()];

          // If the user has exited the novel early, “choice” is undefined here.
          // In this case, we stop here and simply return the dialogue 
          // that has been played UP TO THIS POINT, to prevent an exception.
          if (!choice) {
              console.warn("Archiv-Info: Dialog wurde vom Nutzer vorzeitig beendet.");
              return htmlElement;
          }

          htmlElement += `<p><b>${this.nameMap[1]}:</b> ${choice["text"]}</p>`
          currentEvent = this.novelData.novelEvents.find((element) => element.id == choice.onChoice);
          currentChoices = [];
          break;
        case 16:
          htmlElement += `<p><i><b>Hinweis:</b> ${currentEvent["relevantBias"]}</i></p>`
          currentEvent = this.novelData.novelEvents.find((element) => element.id == currentEvent.nextId);
          break;
        default:
          console.warn(`Event with type ${currentEvent.eventType}`);
          return htmlElement;
      }
    }
    return htmlElement;
  }

  /**
   * Builds the HTML for the saved KI-Feedback of this archive entry.
   * @returns The feedback rendered as paragraphs, or a fallback notice as a string
   */
  createFeedback() {
    const feedback = this.instanceData.kifeedback;

    if (!feedback) {
      return `<p>Für diesen Eintrag ist kein KI-Feedback verfügbar.</p>`;
    }

    return String(feedback)
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
  }
}
customElements.define("date-heading", DateHeading);