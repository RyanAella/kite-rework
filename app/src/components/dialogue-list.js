import { addDragScrolling } from "../drag-scrolling.js";

class DialogueList extends HTMLElement {
  
  constructor() {
    super();
    this.renderQueue = Promise.resolve();
  }

  connectedCallback() {
    this.renderMessageBox();

    this.scrollContainer = this.querySelector('.scroll-container');
    this.messageContainer = this.querySelector('.message-container');
    this.choiceContainer = this.querySelector('.choice-container');

    addDragScrolling(this.scrollContainer);
  }

  renderMessageBox() {
    this.innerHTML = `
      <div class="scroll-container no-scrollbar h-full w-full overflow-y-auto scroll-auto flex flex-col p-[2cqw]">
        <div class="message-container mt-auto flex flex-col gap-[1.6cqw] shrink-0"></div>
        <div class="choice-container flex flex-col gap-[1.3cqw] p-[2cqw] empty:hidden shrink-0"></div>
      </div>
    `;
  }

  async showMessage(text, isUser = false, characterId) {
    this.renderQueue = this.renderQueue.then(() => {
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
        this.messageContainer.appendChild(messageBox);

        requestAnimationFrame(() => {
            this.scrollToBottom();

            let charIndex = 0;
            const typeInterval = setInterval(async () => {
            if (charIndex < text.length) {
              typewriterBox.textContent += text.charAt(charIndex);
              charIndex++;
            } else {
              clearInterval(typeInterval);
              await new Promise(r => setTimeout(r, 750));
              resolve();
            }
          }, 21);
        });
      })
    })
    return this.renderQueue;
  }

  showChoices(arrayOfChoices) {
    this.renderQueue = this.renderQueue.then(() => {
      return new Promise((resolve) => {
        this.choiceContainer.innerHTML = '';

        arrayOfChoices.forEach((choiceObj, index) => {
          const choiceButton = document.createElement('button');

          choiceButton.className = "grid grid-cols-1 grid-rows-1 scale-95 animate-pop-in bg-white rounded-[1.6cqw] text-[3cqw] hover:bg-gray-100 text-left";
          choiceButton.innerHTML = `<span class="z-10 p-[2cqw] transition-colors duration-300 col-start-1 row-start-1">${choiceObj.text}</span>`;

          choiceButton.addEventListener('animationend', (e) => {
            if (e.animationName === 'popInBounce') {
              choiceButton.classList.remove('animate-pop-in');
              choiceButton.classList.add('animate-breathe');
            }
          })

          choiceButton.addEventListener('click', async (e) => {
            const allButtons = this.choiceContainer.querySelectorAll('button');
            allButtons.forEach(btn => {
              btn.disabled = true;
              btn.classList.remove('animate-breathe');
            });
            
            const fillLayer = document.createElement('div');
            fillLayer.className = "h-full p-[2cqw] rounded-[1.6cqw] col-start-1 row-start-1 bg-[#0c447f] transition z-0 place-self-center animate-swipe-blue";
            choiceButton.appendChild(fillLayer);

            const textSpan = choiceButton.querySelector('span');
            textSpan.classList.add('text-white');

            await new Promise(r => setTimeout(r, 750));
            
            this.handleChoiceSelection(index, choiceObj.text);
          });

          this.choiceContainer.appendChild(choiceButton);
        });
        this.scrollToBottom(); 
        resolve();
      })
    }) 
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

  scrollToBottom() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
      });
    })
  }
}


customElements.define("dialogue-list", DialogueList);
