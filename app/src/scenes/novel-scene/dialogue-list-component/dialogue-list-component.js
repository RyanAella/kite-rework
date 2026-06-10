import { addDragScrolling } from "../../../shared-services/drag-scrolling.js";
import "./message-container-component.js";
import "./choice-container-component.js";
import { playAudio } from "../../../shared-services/audio-playing-service.js";

export class DialogueList extends HTMLElement {
  
  constructor() {
    super();
    this.renderQueue = Promise.resolve();
  }

  static create() {
    const newDialogueList = document.createElement('dialogue-list');
    return newDialogueList;
  }

  connectedCallback() {
    this.classList.add("h-[45%]", "shrink-0", "flex", "flex-col", "w-full", "overflow-hidden", "relative", "z-50", "scroll-container", "no-scrollbar", "w-full", "overflow-y-auto", "scroll-auto", "flex", "flex-col", "p-[2cqw]");

    this.addEventListener("scroll-to-bottom", (event) => {this.scrollToBottom()});
    this.addEventListener("handle-choice-selection", (event) => {this.handleChoiceSelection(event.detail['index'], event.detail['text'])});
    this.addEventListener("choice-undo-requested", (event) => {this.handleChoiceUndoRequest(event.detail?.bubble)});

    this.messageContainer = document.createElement('message-container');
    this.choiceContainer = document.createElement('choice-container');

    this.appendChild(this.messageContainer);
    this.appendChild(this.choiceContainer);

    addDragScrolling(this);
  }

  async showMessage(text, isUser = false, characterId, isInstant = false) {
    playAudio("SFX_Textpopup_1");
    this.renderQueue = this.renderQueue.then(() => {
      return this.messageContainer.addMessage(text, isUser, characterId, isInstant);
    });
    return this.renderQueue;
  }

  showChoices(arrayOfChoices) {
    playAudio("SFX_SelectionLoad");
    this.renderQueue = this.renderQueue.then(() => {
      return this.choiceContainer.addChoices(arrayOfChoices);
    });
    return this.renderQueue;
  }

  async handleChoiceSelection(index, text) {
    this.choiceContainer.innerHTML = '';
    await this.showMessage(text, true);
    // Maybe change the information which is passed to the event listener 
    const event = new CustomEvent('user-confirmation', {
      detail: { choiceIndex: index },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * Handles the request to undo a choice.
   * @param {Object} bubble - The bubble element that triggered the request.
   */
  handleChoiceUndoRequest(bubble) {
    if (!bubble) return;
    const bubbles = Array.from(this.messageContainer.querySelectorAll(".js-choice-bubble"));
    const index = bubbles.indexOf(bubble);
    if (index < 0) return;
    this.dispatchEvent(new CustomEvent("request-undo-choice", {
      detail: { index, bubble },
      bubbles: true,
    }));
  }

  /**
   * Undoes a choice by removing the choice bubble and its message.
   * @param {Object} bubble - The bubble element that triggered the request.
   */
  undoToChoice(bubble) {
    if (!bubble) return;

    this.choiceContainer.innerHTML = '';

    let node = bubble.nextSibling;
    while (node) {
      const next = node.nextSibling;
      node.remove();
      node = next;
    }
    bubble.remove();
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.scrollTop = this.scrollHeight;
      });
    })
  }
}
customElements.define("dialogue-list", DialogueList);
