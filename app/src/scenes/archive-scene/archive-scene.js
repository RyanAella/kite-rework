import { addDragScrolling } from "../../shared-services/drag-scrolling-service.js";
import { NovelHeading } from "./novel-heading-component/novel-heading-component.js";
import { getArchiveData } from "../../shared-services/archive-data-service.js";
import { fetchFromJson } from "../../shared-services/fetch-service.js";
import { CopyToast } from "../../shared-components/copy-toast-component.js";

class ArchiveScene extends HTMLElement {

  async connectedCallback() {

    this.novelData = await fetchFromJson("assets/json/novels.json");

    this.classList = "relative h-full w-full grid grid-cols-1 grid-rows-1";
    this.innerHTML = `
      <div class="row-start-1 col-start-1 flex h-full w-full flex-col font-sans text-[#0b1a2d]">
        <back-header class="w-full shrink-0"></back-header>
        <div class="inset-0"></div>

        <div id="scroll-container" class="z-10 flex w-full h-[160cqw] flex-1 flex-col bg-bright bg-cover px-[5cqw] overflow-x-hidden overflow-y-scroll no-scrollbar">
          <div class="flex w-full flex-col items-center pt-[9cqw]">
            <img
              src="assets/Images/IconsAndLogos/Icon_GameArchive.png"
              alt="Icon_GameArchive"
              class="w-[28cqw] aspect-square object-contain"
            />
            <h1 class="select-none text-center text-[4.4cqw] font-bold tracking-tight text-[#284673]">
              SPIEL-ARCHIV
            </h1>
            <p class="pt-[7cqw] text-[3.6cqw] font-medium tracking-tight text-[#284673]">
              Hier findest du deine gespielten Dialoge und Analysen in chronologischer Reihenfoge zum Nachlesen. Du kannst sie in die Zwischenablge kopieren, um sie auch an anderer stelle zu verwenden.
            </p>
          </div>
          <div id="novel-container" class="w-full mt-[7cqw]"></div>
        </div>
        <main-footer active-scene="archive-scene"></main-footer>
      </div>
    `;

    this.addEmptyinfoText();

    addDragScrolling(this.querySelector('#scroll-container'));
    this.novelContainer = this.querySelector("#novel-container");

    this.addHeadings();

    this.addEventListener("show-popup", (event) => {
      CopyToast.show(this, event.detail.text);
    });
  }

  /**
   * Adds a novel Heading for each Archive Storage Entry.
   */
  addHeadings() {
    this.instanceData = getArchiveData(true);
    Object.entries(this.instanceData).forEach(([key, value]) => {
      const heading = NovelHeading.create(this.novelData.visualNovels.find((element) => element.name == key), value);
      this.novelContainer.appendChild(heading);
    });
  }

  /**
   * Adds the Informational Text, that shows, when no entry is present.
   */
  addEmptyinfoText() {
    const novelContainer = this.querySelector("#novel-container");
    let emptyText = document.createElement("p");
    emptyText.id = "empty-info-text";
    emptyText.classList = "text-[3.6cqw] font-medium tracking-tight text-[#284673]"
    emptyText.innerHTML = "Spiele eine Novel, um hier deinen ersten Eintrag zu sehen."
    novelContainer.appendChild(emptyText);
  }
}
customElements.define("archive-scene", ArchiveScene);