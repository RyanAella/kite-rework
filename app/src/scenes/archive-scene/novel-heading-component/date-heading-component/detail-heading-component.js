const heading_size = 4.5;

export class DetailHeading extends HTMLElement {

  static create(novelData, title, extendedHTML, copyPopupText) {
    const element = document.createElement("detail-heading");
    element.novelData = novelData;
    element.title = title;
    element.extendedHTML = extendedHTML;
    element.copyPopupText = copyPopupText;
    element.load();
    return element;
  }

  connectedCallback() {
    console.log("DEBUG: Detail Heading Connected");
  }

  load() {
    this.hex = this.novelData['novelColor'];
    this.classList = "flex flex-col w-full mt-[1cqw]";

    this.innerHTML = `
        <div id="detail-heading" class="flex flex-row border-b-5 h-[10cqw] items-center justify-center mx-[5cqw] p-4" style="border-color: ${this.hex}">
          <p class="user-font w-full text-center" style="color: ${this.hex}">${this.title}</p>
          <div 
            id="arrow-img"
            class="w-[6cqw] h-[6cqw]"
            style="
              background-color: ${this.hex}; 
              mask-image: url('assets/Images/DropDown/Arrow_Left.png'); 
              mask-size: contain; 
              mask-repeat: no-repeat; 
              mask-position: center;
              -webkit-mask-image: url('assets/Images/DropDown/Arrow_Left.png'); 
              -webkit-mask-size: contain; 
              -webkit-mask-repeat: no-repeat;
              -webkit-mask-position: center;
            ">
          </div>
        </div>
        <div id="content-container" class="flex flex-col mx-[5cqw]"></div>
        `;
    
    const copyButton = document.createElement('div');
    copyButton.classList = "flex flex-row h-[5cqw] items-center justify-center text-[5cqw]"
    copyButton.innerHTML =
      `<img src="assets/Images/Buttons/copy.png" class="h-full"></img>
       <p class="font-bold ml-[2cqw]">Kopieren</p>`
    copyButton.addEventListener("click", () => {
      let copyText = this.extendedHTML;
      copyText = copyText.replaceAll("<i>", "");
      copyText = copyText.replaceAll("</i>", "");
      copyText = copyText.replaceAll("<b>", "");
      copyText = copyText.replaceAll("</b>", "");
      copyText = copyText.replaceAll("<p>", "");
      copyText = copyText.replaceAll("</p>", "\n\n");
      navigator.clipboard.writeText(copyText);
      console.log("Emitting Event")
      this.dispatchEvent(new CustomEvent("show-popup", {
        detail: { 
          text: this.copyPopupText
        },
        bubbles: true,
      }));
    })

    this.arrowImg = this.querySelector('#arrow-img');
    this.contentContainer = this.querySelector('#content-container');
    this.heading = this.querySelector('#detail-heading')

    this.heading.addEventListener("click", () => {
      console.log("click");
      console.log(this.arrowImg);
      if(this.contentContainer.childNodes.length === 0) {
        console.log("1");
        this.arrowImg.style.maskImage = "url('assets/Images/DropDown/Arrow_Down.png')"
        this.arrowImg.style.webkitMaskImage = "url('assets/Images/DropDown/Arrow_Down.png')"
        const content = document.createElement('div');
        content.classList = "user-font flex flex-col gap-[2cqw]"
        content.innerHTML = this.extendedHTML;
        this.contentContainer.replaceChildren(content, copyButton);
      } else {
        console.log("2");
        this.arrowImg.style.maskImage = "url('assets/Images/DropDown/Arrow_Left.png')";
        this.arrowImg.style.webkitMaskImage = "url('assets/Images/DropDown/Arrow_Left.png')";
        this.contentContainer.replaceChildren();
      }
    });

  }
}
customElements.define("detail-heading", DetailHeading);