export class ChoiceContainer extends HTMLElement {

  connectedCallback() {
    this.classList = "flex flex-col gap-[1.3cqw] p-[2cqw] empty:hidden shrink-0"
  }

  addChoices(arrayOfChoices) {
    return new Promise((resolve) => {
      this.innerHTML = '';

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
          const allButtons = this.querySelectorAll('button');
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

          this.dispatchEvent(new CustomEvent("handle-choice-selection", {detail: {
              "index": index,
              "text": choiceObj.text
            },
            bubbles: true
          }));
        });

        this.appendChild(choiceButton);
      });
      this.dispatchEvent(new CustomEvent("scroll-to-bottom", {bubbles: true}));
      resolve();
    });
  }
}
customElements.define("choice-container", ChoiceContainer);