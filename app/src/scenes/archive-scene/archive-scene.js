import { addDragScrolling } from "../../shared-services/drag-scrolling.js";
import { NovelHeading } from "./novel-heading-component/novel-heading-component.js";
import { getArchiveData } from "../../shared-services/archive-data-service.js";

class ArchiveScene extends HTMLElement {

  constructor() {
    super();
  }

  async connectedCallback() {

    let response = await fetch("assets/json/novels.json");
    this.novelData = await response.json();

    console.log("Archive Scene loaded");

    this.classList = "h-full w-full grid grid-cols-1 grid-rows-1";
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
      <div id="popup-container" class="hidden row-start-1 col-start-1 h-full w-full flex items-center justify-center z-10"></div>
    `;

    this.addEmptyinfoText();

    this.createPopUp();

    addDragScrolling(this.querySelector('#scroll-container'));
    this.novelContainer = this.querySelector("#novel-container");

    this.addHeadings();

    this.addEventListener("show-popup", (event) => {
      console.log("Showing Popup")
      this.popUpText.innerHTML = event.detail.text
      this.popupContainer.classList.remove("hidden");
      setTimeout(() => this.popupContainer.classList.add("hidden"), 1000);
    });
  }

  addHeadings() {
    this.instanceData = getArchiveData(true);
    Object.entries(this.instanceData).forEach(([key, value]) => {
      console.log(key);
      console.log(value);
      const heading = NovelHeading.create(this.novelData.visualNovels.find((element) => element.name == key), value);
      this.novelContainer.appendChild(heading);
    });
  }

  createPopUp() {
    this.popupContainer = this.querySelector('#popup-container');
    let popUp = document.createElement('div');
    popUp.classList = "flex h-[23cqw] w-[55cqw] mt-[15cqw] flex-col items-center justify-center rounded-[4cqw] bg-[#132034] text-white text-center"
    this.popUpText = document.createElement("p");
    popUp.replaceChildren(this.popUpText);
    this.popupContainer.appendChild(popUp);
  }

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