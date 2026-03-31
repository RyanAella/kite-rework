class DialogueList extends HTMLElement {
  
  constructor() {
    super();
  }

  connectedCallback() {
    this.renderMessageBox();

    this.messageContainer = this.querySelector('.message-container');
    this.choiceContainer = this.querySelector('.choice-container');
  }

  renderMessageBox() {
    this.innerHTML = `
      <div class="message-container flex-1 overflow-y-auto flex flex-col p-5 gap-4"></div>
      <div class="choice-container flex flex-col gap-2.5 p-5 empty:hidden"></div>
    `;
  }

  // Provide input variable to distinguish between message sender to adjust message color and position (left/right)
  showMessage(text) {
    const messageBox = document.createElement('div');
    const baseClasses = "max-w-[80%] leading-relaxed break-words text-white bg-cyan-700 p-4 rounded-lg text-base text-left";

    // if() {
    //     messageBox.className = `${baseClasses} self-start bg-kite-green rounded-bl-sm`;
    // } else {
    //   messageBox.className = `${baseClasses} self-end bg-kite-blue rounded-br-sm`;
    // }

    messageBox.className = baseClasses

    messageBox.textContent = text;
    this.messageContainer.appendChild(messageBox);
    this.scrollToBottom();
  }

  showChoices(arrayOfChoices) {
    this.choiceContainer.innerHTML = '';

    arrayOfChoices.forEach((choiceObj, index) => {
      const choiceButton = document.createElement('button');

      choiceButton.className = "bg-white border-2 border-gray-300 p-4 rounded-lg text-base cursor-pointer transition-colors duration-200 hover:bg-gray-100 text-left";

      choiceButton.textContent = choiceObj.text;

      choiceButton.addEventListener('click', () => {
        this.handleChoiceSelection(index, choiceObj.text);
      });

      this.choiceContainer.appendChild(choiceButton);
    });
    this.scrollToBottom();  
  }

  handleChoiceSelection(index, text) {
    this.choiceContainer.innerHTML = '';
    this.showMessage(text);
    // Maybe change the information which is passed to the event listener 
    const event = new CustomEvent('user-confirmation', {
      detail: { choiceIndex: index },
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    });
  }
}


customElements.define("dialogue-list", DialogueList);
