
import { DialogueList } from "./dialogue-list-component/dialogue-list-component.js";
import { CharacterBox } from "./character-box-component/character-box-component.js";
import { InteractiveObjects } from "./interactive-objects-component.js";
import "../../shared-components/headers/back-header.js";
import "../../shared-components/headers/base-header.js";
import {
  createContinuePopUp,
  createPausePopUp,
  isIntroNovel,
  shouldShowContinuePopUp,
} from "./person-popup-setup-service.js";
import { EventResolver } from "./event-resolver-component.js";
import { attachDialogueSkipOnOutsideClick } from "./dialogue-list-component/dialogue-skip-service.js";
import { fetchFromJson } from "../../shared-services/fetch-service.js";
import { novelStateStore } from "../../shared-services/store-service.js";
import { setCompletedFlag } from "../../shared-services/progress-tracking-service.js";

class NovelScene extends HTMLElement {

  novel = {};

  eventResolver;
  background;
  dialogueList;
  pausePopUp;
  continuePopUp;
  characterObjectSync = {};

  connectedCallback() {
    this.novel = this.args['novel']
    let flag = this.args['needBaseHeader'];
    
    //Adding Styling
    this.classList.add("flex", "flex-col", "items-center", "justify-center", "w-full", "h-full", "bg-blue-50/30", "font-sans", "overflow-hidden", "relative");

    //EventListener Setup
    this.addEventListener("user-confirmation", (event) => { this.eventResolver.userConfirmation(event)});
    this.addEventListener("add-character", (event) => {this.addCharacter(event.detail.characterId)});
    this.addEventListener("resolve-event", (event) => {this.eventResolver.resolveCurrentEvent()});
    this.addEventListener("novel-finished", (event) => {novelStateStore.clear(this.novel.name)});
    this.addEventListener("sync-object-to-character", (event) => {this.syncObjectToCharacter(event.detail.object, event.detail.characterId)});

    //Create Child Elements
    this.createBackground();
    this.dialogueList = DialogueList.create();
    this.eventResolver = EventResolver.create(this.novel["name"], this.novel['novelEvents'], this.dialogueList, !!!this.novel['disablePauseMenu']);

    // on resume triggert den event resolver normal mit dem nächsten Event weiterzumachen
    // on pause erstellt einen snapshot vom aktuellen event stand im resolver und speichert den zustand durch das klicken auf pausieren
    // on leave löscht den Zustand aus dem store und geht zurück zum novel selector
    this.pausePopUp = createPausePopUp(this.novel, {
      onResume: () => this.eventResolver.resume(),
      onPause: () => {
          const snapShot = this.eventResolver.getSnapshot();
          if (snapShot) {
              novelStateStore.save(this.novel.name, snapShot);
          }
          this.switchToNovelSelector();
      },
      onLeaveNovel: () => {
          novelStateStore.clear(this.novel.name);
          this.switchToNovelSelector();
      },
      onFinish: () => {
        console.log("Finishing event entered.");
        if(this.eventResolver.tracking) setCompletedFlag(this.eventResolver.storageKey);
        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: {
            scene : `${this.eventResolver.tracking ? "completion-scene" : "novel-selector"}`
          },
          bubbles : true
        }))
      }
    });
    
    const header = document.createElement(flag ? "base-header" : "back-header");
    if(!flag) {
      header.addEventListener('sm-back', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        this.eventResolver.pause();
        this.pausePopUp.toggle(true);
        console.log("Back button was clicked!")
      });
    }

    // Add ChildElements to DOM
    this.appendChild(this.eventResolver);
    this.appendChild(header);
    this.appendChild(this.background);

    this.addInteractiveObjects();

    this.background.appendChild(this.dialogueList);
    this.appendChild(this.pausePopUp);

    if (!isIntroNovel(this.novel)) {
      const hasSavedState = shouldShowContinuePopUp(this.novel.name);

      // on continue läuft beim weiterspielen nach dem continue pop up
      // Hier wird der davor gespeicherte snapshot aus dem store geladen und wieder in den resolver übertragen
      this.continuePopUp = createContinuePopUp(this.novel, {
        onContinue: async () => {
          const snapShot = novelStateStore.load(this.novel.name);
          if (snapShot) {
            this.eventResolver.loadSnapshot(snapShot);

            await this.restoreVisualState(snapShot.history);

            const type = this.eventResolver.currentEvent['eventType'];
            if ([2, 4].includes(type)) {
              this.eventResolver.switchToNext();
            }
          }
          this.resolveEvent();
        },
        onRestart: () => {
          novelStateStore.clear(this.novel.name); // Alten State löschen
          this.eventResolver.currentEvent = this.novel["novelEvents"][0];
          this.resolveEvent();
        },
      });

      this.appendChild(this.continuePopUp);

      if (hasSavedState) {
        this.continuePopUp.toggle(true);
      } else {
        this.resolveEvent();
      }
    } else {
      this.resolveEvent();
    }

    attachDialogueSkipOnOutsideClick(this.background, this.dialogueList);
  }

  switchToNovelSelector() {
    this.dispatchEvent(
      new CustomEvent("sm-switch-scene", {
        detail: { scene: "novel-selector" },
        bubbles: true,
      }),
    );
  }

  resolveEvent() {
    this.dispatchEvent(
      new CustomEvent("resolve-event", {
        bubbles: true,
      }),
    );
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
  
  /**
   * Created a new CharacterBox and adds it to the DOM
   * @param {Number} characterId The Id of the new Character
   */
  async addCharacter(characterId) {
    let characterBox = await CharacterBox.create(this.novel['name'], characterId, this.characterObjectSync[characterId] ?? []);
    this.background.appendChild(characterBox);
    this.eventResolver.addCharacterCallback();
  }

  /**
   * Synchronizes an Object to a character, causing the characters animations to be applied to the object as well
   * @param {HTMLElement} object 
   * @param {Number} characterId 
   */
  syncObjectToCharacter(object, characterId) {
    if(!this.characterObjectSync[characterId]) {
      this.characterObjectSync[characterId] = [];
    }
    this.characterObjectSync[characterId].push(object);
  }

  async addInteractiveObjects() {
    const interactiveObjectData = await fetchFromJson("assets/json/interactive-objects-info.json");
    this.background.appendChild(InteractiveObjects.create(interactiveObjectData.visualNovels.find((element) => element.name == this.novel['name']).interactiveObjects));
  }

  // Methode regeneriert in der UI die gespeicherten events aus der history, welche beim pausieren gespeichert wurden, messages hinzufügen, character hinzufügen, ...
  // Wenn spiel weitergespielt wird, lädt diese methode alle vergangegen events aus der history
  async restoreVisualState(history) {
    console.log("History " + history);
    if (!history || history.length === 0) return;

    for (const oldEvent of history) {
      switch (oldEvent.eventType) {
        case 2:
          let characterBox = await CharacterBox.create(this.novel['name'], oldEvent.character, this.characterObjectSync[oldEvent.character] ?? []);
          if (oldEvent.expressionType) {
            characterBox.updateCharacterExpression(oldEvent.expressionType);
          }
          this.background.appendChild(characterBox);
          break;
        case 4:
          await this.dialogueList.showMessage(oldEvent.text, false, oldEvent.character, true);
          break;
      }
    }
  }
}

customElements.define("novel-scene", NovelScene);
