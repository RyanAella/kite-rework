import { DateHeading } from "./date-heading-component/date-heading-component.js";

const heading_size = 4.5;

export class NovelHeading extends HTMLElement {

  static create(novelData, instanceData) {
    console.log(novelData);
    console.log(instanceData);
    const element = document.createElement("novel-heading");
    element.novelData = novelData;
    element.instanceData = instanceData;
    element.load();
    return element;
  }

  connectedCallback() {
    console.log("DEBUG: Heading Connected");
  }

  load() {
    this.classList = "flex flex-col w-full mt-[1cqw]";
    this.innerHTML = `
      <div 
        id="novel-heading"
        class="w-full h-[${2*heading_size}cqw] flex flex-row items-center justify-center p-4 text-center text-white text-[3.5cqw]"
        style="
          background-color: ${this.novelData['novelColor']};
          clip-path: polygon(0cqw ${heading_size}cqw, ${heading_size}cqw 0cqw, ${90 - heading_size}cqw 0cqw, 90cqw ${heading_size}cqw, ${90 - heading_size}cqw ${2*heading_size}cqw, ${heading_size}cqw ${2* heading_size}cqw);
        "
      >
        <span class="ml-[3cqw]">${this.novelData['title']}</span>
        <div class="w-[5cqw] h-[5cqw] bg-[#fe5d03] rounded-full ml-auto mr-[3cqw] font-mono">
          ${this.instanceData.length}
        </div>
        <img id="arrow-img" src="assets/Images/DropDown/Arrow_Left.png" class="w-[6cqw] h-[6cqw] mr-[4cqw]"/>
      </div>
      <div id="date-heading-container"></div>
    `;
    this.novelHeading = this.querySelector("#novel-heading");
    this.dateHeadingContainer = this.querySelector('#date-heading-container');
    this.arrowImg = this.querySelector('#arrow-img');

    this.novelHeading.addEventListener("click", () => {
      if(this.dateHeadingContainer.childNodes.length === 0) {
        this.arrowImg.src = "assets/Images/DropDown/Arrow_Down.png"
        this.instanceData.forEach(element => {
          this.dateHeadingContainer.appendChild(DateHeading.create(this.novelData, element));
        });
      } else {
        this.arrowImg.src = "assets/Images/DropDown/Arrow_Left.png";
        this.dateHeadingContainer.replaceChildren();
      }
    });
  }
}
customElements.define("novel-heading", NovelHeading);