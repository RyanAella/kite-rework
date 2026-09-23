const PERSON_IMAGE_PATH = "assets/Images/PopUp/Person_PopUp.png";

// Styling classes for the person image, overlay, buttons and modal
const PERSON_IMAGE_CLASS =
  "relative z-0 block shrink-0 translate-y-[4cqw] -mb-[9cqw] object-contain pointer-events-none";

const DEFAULT_OVERLAY_CLASS =
  "absolute inset-0 bg-black/50 z-[100] hidden transition-opacity duration-300";

const PRIMARY_BUTTON_CLASS =
  "py-[1.6cqw] px-[0.8cqw] rounded-[0.6cqw] font-bold text-[2.8cqw] text-center border-[0.3cqw] border-white bg-white";

const SECONDARY_BUTTON_CLASS =
  "py-[1.6cqw] px-[0.8cqw] rounded-[0.6cqw] font-bold text-[2.8cqw] text-center border-[0.3cqw] text-white border-white bg-transparent";


/**
 * Popup with a person image behind a colored text box.
 * Pass content (title, text, buttons) through config — see buildModal().
 */
export class PersonPopUp extends HTMLElement {
  static create(config) {
    const popUp = document.createElement("person-pop-up");
    if (config) {
      popUp.config = config;
    }
    return popUp;
  }

  connectedCallback() {
    if (!this.config) {
      console.error("PersonPopUp: config was not provided!");
      return;
    }
    this.buildUI();
    this.toggle(this.config.initiallyVisible === true);
  }

  /**
   * Build the UI of the pop-up
   */
  buildUI() {
    const { overlayClass = DEFAULT_OVERLAY_CLASS, modalWidth = "w-[80%]" } = this.config;

    this.overlay = document.createElement("div");
    this.overlay.className = overlayClass;

    const wrapper = document.createElement("div");
    wrapper.className = `absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 relative flex flex-col items-center gap-0 ${modalWidth}`;

    wrapper.appendChild(this.createPersonImage());
    wrapper.appendChild(this.buildModal());

    this.overlay.appendChild(wrapper);
    this.appendChild(this.overlay);
  }

  /**
   * Create the person image
   * @returns the created uimage
   */
  createPersonImage() {
    const img = document.createElement("img");
    img.src = PERSON_IMAGE_PATH;
    img.alt = "";
    img.className = PERSON_IMAGE_CLASS;
    return img;
  }

  /**
   * Build the modal
   * @returns 
   */
  buildModal() {
    const {
      novelColor,
      title,
      infoText,
      descriptions = [],
      buttons = [],
      btnContainerClass = "grid grid-cols-2 gap-[2.5cqw] mt-[2cqw]",
    } = this.config;

    const modal = document.createElement("div");
    modal.className =
      "relative z-10 w-full text-white rounded-t-[3cqw] rounded-b-[3cqw] p-[6cqw] flex flex-col gap-[4cqw] font-sans";
    modal.style.backgroundColor = novelColor;

    // Add the title if it is provided
    if (title) {
      const titleEl = document.createElement("h2");
      titleEl.innerText = title;
      titleEl.className = "user-font mb-[5cqw]";
      modal.appendChild(titleEl);
    }

    // Add the info text if it is provided
    if (infoText) {
      const infoEl = document.createElement("p");
      infoEl.className = "user-font leading-normal mb-[8cqw]";
      infoEl.innerText = infoText;
      modal.appendChild(infoEl);
    }

    // Add the descriptions if they are provided
    if (descriptions.length > 0) {
      const list = document.createElement("div");
      list.className = "user-font flex flex-col gap-[2cqw] leading-[1.4]";
      for (const { label, text } of descriptions) {
        const line = document.createElement("p");
        line.className = "my-0";
        line.innerHTML = `<span class="font-bold">${label}</span>${text}`;
        list.appendChild(line);
      }
      modal.appendChild(list);
    }

    // Add the buttons if they are provided
    const btnContainer = document.createElement("div");
    btnContainer.className = btnContainerClass;
    for (const buttonConfig of buttons) {
      btnContainer.appendChild(this.createButton(buttonConfig, novelColor));
    }
    modal.appendChild(btnContainer);

    return modal;
  }

  // Create a button with the given configuration
  createButton({ text, isPrimary, onClick, className }, novelColor) {
    const btn = document.createElement("button");
    btn.innerText = text;

    if (className) {
      btn.className = className;
    } else if (isPrimary) {
      btn.className = PRIMARY_BUTTON_CLASS;
    } else {
      btn.className = SECONDARY_BUTTON_CLASS;
    }

    if (isPrimary) {
      btn.style.color = novelColor;
    }

    btn.addEventListener("click", onClick);
    return btn;
  }

  // Toggle the visibility of the pop-up
  toggle(show) {
    if (!this.overlay) return;
    this.overlay.classList.toggle("hidden", !show);
    this.overlay.classList.toggle("block", show);
  }
}

customElements.define("person-pop-up", PersonPopUp);
