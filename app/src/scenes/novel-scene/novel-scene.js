
import { DialogueList } from "./dialogue-list-component/dialogue-list-component.js";
import { CharacterBox } from "./character-box-component/character-box-component.js";
import { InteractiveObjects } from "./interactive-objects-component.js";
import "../../shared-components/headers/back-header.js";
import "../../shared-components/headers/base-header.js";
import { PausePopUp } from "./pause-pop-up-component.js";
import { ContinuePopUp } from "./continue-pop-up-component.js";
import { EventResolver } from "./event-resolver-component.js";
import { attachDialogueSkipOnOutsideClick } from "./dialogue-list-component/dialogue-skip-service.js";

class NovelScene extends HTMLElement {

  novel = {};

  eventResolver;
  background;
  dialogueList;
  pausePopUp;
  continuePopUp;

  connectedCallback() {
    this.novel = this.args['novel']
    let flag = this.args['needBaseHeader'];
    
    //Adding Styling
    this.classList.add("flex", "flex-col", "items-center", "justify-center", "w-full", "h-full", "bg-blue-50/30", "font-sans", "overflow-hidden", "relative");

    //EventListener Setup
    this.addEventListener("user-confirmation", (event) => { this.eventResolver.userConfirmation(event)});
    this.addEventListener("add-character", (event) => {this.addCharacter(event.detail.characterId)});
    this.addEventListener("resolve-event", (event) => {this.eventResolver.resolveCurrentEvent()});

    //Create Child Elements
    this.createBackground();
    this.dialogueList = DialogueList.create();
    this.eventResolver = EventResolver.create(this.novel['novelEvents'], this.dialogueList);
    this.pausePopUp = PausePopUp.create(this.novel);
    this.continuePopUp = ContinuePopUp.create(this.novel, this);
    
    const header = document.createElement(flag ? "base-header" : "back-header");
    if(!flag) {
      header.addEventListener('sm-back', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        this.pausePopUp.togglePauseMenu(true);
      });
    }

    // Add ChildElements to DOM
    this.appendChild(this.eventResolver);
    this.appendChild(header);
    this.appendChild(this.background);
    this.background.appendChild(InteractiveObjects.create(this.novel['interactiveObjects']));
    this.background.appendChild(this.dialogueList);

    this.appendChild(this.pausePopUp);
    this.appendChild(this.continuePopUp);

    attachDialogueSkipOnOutsideClick(this.background, this.dialogueList);
  }

  createBackground() {
    const backgroundImage = new Image();
    backgroundImage.src = 'assets/Images/Background/' + this.novel['name'] + '_BG.png';
    const background = document.createElement('div');
    background.style.backgroundImage = 'url(' + backgroundImage.src + ')';
    background.id = 'background';
    background.classList.add("pointer-events-auto", "bg-[length:100%_100%]", "bg-no-repeat", "bg-center", "flex-1", "w-full", "flex", "flex-col", "justify-start", "overflow-hidden", "relative", "z-0");
    this.background = background;
  }
  
  async addCharacter(characterId) {
    let characterBox = await CharacterBox.create(this.novel['name'], characterId);
    this.background.appendChild(characterBox);
    this.eventResolver.addCharacterCallback();
  }
}

customElements.define("novel-scene", NovelScene);
