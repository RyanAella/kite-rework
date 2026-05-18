import { runTypewriterAnimation } from "./dialogue-skip-service.js";

export class MessageContainer extends HTMLElement {

  connectedCallback() {
    this.classList = "mt-auto flex flex-col gap-[1.6cqw] shrink-0"
  }

  addMessage(text, isUser = false, characterId) {
    return new Promise((resolve) => {
      const messageBox = document.createElement('div');
      const baseClasses = "leading-relaxed text-white p-[2cqw] rounded-[1.6cqw] text-[3cqw] text-left grid origin-bottom animate-pop-in";

      if(isUser || characterId == 1) {
        console.log("ID -> " + characterId);
        messageBox.className = `${baseClasses} max-w-[90%] self-end bg-[#0c447f]`;
      } else if(characterId >= 5 && characterId <= 12) {
        console.log("ID -> " + characterId);
        messageBox.className = `${baseClasses} max-w-[90%] self-start bg-[#393a39]`;
      } else {
        messageBox.className = `${baseClasses} w-full self-center bg-[#0e7f90]`;
      }

      const invisibleBox = document.createElement('span');
      invisibleBox.className = "invisible col-start-1 row-start-1";
      invisibleBox.textContent = text;

      const typewriterBox = document.createElement('span');
      typewriterBox.className = "col-start-1 row-start-1";
      typewriterBox.textContent = '';

      messageBox.appendChild(invisibleBox);
      messageBox.appendChild(typewriterBox);
      this.appendChild(messageBox);

      runTypewriterAnimation(this, {
        text,
        typewriterBox,
        resolve,
        onBeforeStart: () => {
          this.dispatchEvent(new CustomEvent("scroll-to-bottom", { bubbles: true }));
        },
      });
    })
  }
}
customElements.define("message-container", MessageContainer);