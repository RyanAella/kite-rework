// Information popup component for showing and hiding the information popup component
class InformationPopupComponent extends HTMLElement {
  // Build the information popup component
  connectedCallback() {
    if (this.dataset.built === "1") return;
    this.dataset.built = "1";
    this.className =
      "col-start-1 row-start-1 flex h-full w-full items-center justify-center bg-white/50";

    this.innerHTML = `
      <div class="flex min-h-[43cqw] w-[85cqw] flex-col items-center rounded-[2cqw] bg-[#132034]">
        <div class="mb-[5cqw] w-[80cqw] border-b-[0.5cqw] p-[2cqw] text-center text-[5cqw] text-white">
          INFORMATION
        </div>
        <p id="popup-information-text" class="user-font mb-[2cqw] w-[80cqw] text-white"></p>
        <div id="popup-button" class="mt-auto mb-[5cqw] flex h-[7.5cqw] w-[30cqw] items-center justify-center border-[0.2cqw] text-[3cqw] text-white">
          OK
        </div>
      </div>
    `;

    // Set the popup button listener
    this.querySelector("#popup-button").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("information-popup-close", { bubbles: true }),
      );
    });

    // Set the information text
    if (this._pendingInformationMessage != null) {
      const el = this.querySelector("#popup-information-text");
      if (el) el.innerHTML = this._pendingInformationMessage;
      this._pendingInformationMessage = null;
    }
  }

  // Set the information text
  setInformationText(message) {
    const html = String(message);
    this._pendingInformationMessage = html;
    const el = this.querySelector("#popup-information-text");
    if (el) {
      el.innerHTML = html;
      this._pendingInformationMessage = null;
    }
  }
}

customElements.define("information-popup-component", InformationPopupComponent);
