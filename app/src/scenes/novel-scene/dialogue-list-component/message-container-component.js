import { runTypewriterAnimation } from "./dialogue-skip-service.js";

export class MessageContainer extends HTMLElement {

  connectedCallback() {
    this.classList = "mt-auto flex flex-col gap-[1.6cqw] shrink-0"
  }

  /**
   * Adds a message to this message container.
   * @param {string} text The text contents of this message
   * @param {*} isUser Whether this message is the result of a user choice
   * @param {*} characterId The ID of the Character that speaks this message
   * @param {*} isInstant Whether the message is added without an animation
   * @param {*} novelName Optional: The name of the current novel for special cases
   * @returns a promise for the created messageBox
   */
  addMessage(text, isUser = false, characterId, isInstant = false, novelName = null) {
    return new Promise((resolve) => {
      const messageBox = document.createElement('div');
      const baseClasses = "user-font leading-neutral text-white p-[2cqw] rounded-[1.6cqw] text-left grid origin-bottom animate-pop-in break-words";

      const isChoiceBubble = isUser || characterId == 1;
      if (isChoiceBubble) {
        messageBox.className = `${baseClasses} w-[90%] self-end bg-[#0c447f]`;
      } else if (characterId == 4 || (characterId == 2 && novelName === "Einstieg")) {
        // Info character - centered with info color
        // Character 2 in Einstieg novel also gets info styling
        messageBox.className = `${baseClasses} w-full self-center bg-[#0e7f90]`;
      } else {
        // All NPCs - left-aligned with NPC color
        messageBox.className = `${baseClasses} w-[90%] self-start bg-[#393a39]`;
      }

      // Only the user's own choices are undoable.
      if (isUser) {
        messageBox.classList.add("js-choice-bubble", "cursor-pointer");
        messageBox.addEventListener("click", () => {
          this.dispatchEvent(
            new CustomEvent("choice-undo-requested", {
              detail: { bubble: messageBox },
              bubbles: true,
            }),
          );
        });
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

      if (isInstant) {
        typewriterBox.textContent = text;
        this.dispatchEvent(new CustomEvent("scroll-to-bottom", { bubbles: true }));
        resolve(messageBox);
      } else {
        runTypewriterAnimation(this, {
        text,
        typewriterBox,
        resolve: () => resolve(messageBox),
          onBeforeStart: () => {
            this.dispatchEvent(new CustomEvent("scroll-to-bottom", { bubbles: true }));
          },
        });
      }
    })
  }
}
customElements.define("message-container", MessageContainer);