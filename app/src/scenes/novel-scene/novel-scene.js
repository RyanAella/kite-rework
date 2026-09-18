
import { DialogueList } from "./dialogue-list-component/dialogue-list-component.js";
import { CharacterBox } from "./character-box-component/character-box-component.js";
import { InteractiveObjects } from "./interactive-objects-component.js";
import "../../shared-components/headers/back-header-component.js";
import "../../shared-components/headers/base-header-component.js";
import {
  createContinuePopUp,
  createPausePopUp,
  createUndoChoicePopUp,
  isIntroNovel,
  shouldShowContinuePopUp,
} from "./person-popup-setup-service.js";
import { EventResolver } from "./event-resolver-component.js";
import { attachDialogueSkipOnOutsideClick } from "./dialogue-list-component/dialogue-skip-service.js";
import { fetchFromJson } from "../../shared-services/fetch-service.js";
import { novelStateStore } from "../../shared-services/store-service.js";
import {
  markNovelSessionStarted,
  markNovelSessionEnded,
} from "../../shared-services/novel-session-service.js";
import { playAudio } from "../../shared-services/audio-playing-service.js";
import { setCompletedFlag } from "../../shared-services/progress-tracking-service.js";

class NovelScene extends HTMLElement {

  args = {
    "novel": null,
    "needBaseHeader": false,
    "snapshot": null
  }

  novel = {};

  eventResolver;
  background;
  dialogueList;
  pausePopUp;
  continuePopUp;
  undoChoicePopUp;
  pendingUndo = null;
  characterObjectSync = {};

  connectedCallback() {
    this.novel = this.args['novel']
    let needBaseHeader = this.args['needBaseHeader'];

    // Mark novel session active so Settings/Legal can disable footer nav while playing.
    markNovelSessionStarted();

    //Adding Styling
    this.classList.add("flex", "flex-col", "items-center", "justify-center", "w-full", "h-full", "bg-blue-50/30", "font-sans", "overflow-hidden", "relative");

    //EventListener Setup
    this.addEventListener("user-confirmation", (event) => { this.eventResolver.userConfirmation(event)});
    this.addEventListener("add-character", (event) => {this.addCharacter(event.detail.characterId)});
    this.addEventListener("resolve-event", (event) => {this.eventResolver.resolveCurrentEvent()});
    this.addEventListener("request-undo-choice", (event) => { this.requestUndoChoice(event.detail) });
    this.addEventListener("novel-finished", (event) => {
      novelStateStore.clear(this.novel.name);
      markNovelSessionEnded();
    });
    this.addEventListener("sync-object-to-character", (event) => {this.syncObjectToCharacter(event.detail.object, event.detail.characterId)});

    //Create Child Elements
    this.createBackground();
    this.dialogueList = DialogueList.create(this.novel["name"]);
    this.eventResolver = EventResolver.create(this.novel["name"], this.novel['novelEvents'], this.dialogueList, !!!this.novel['disablePauseMenu']);

    // on resume triggert den event resolver normal mit dem nächsten Event weiterzumachen
    // on pause erstellt einen snapshot vom aktuellen event stand im resolver und speichert den zustand durch das klicken auf pausieren
    // on leave löscht den Zustand aus dem store und geht zurück zum novel selector
    this.pausePopUp = createPausePopUp(this.novel, {
      onResume: () => this.eventResolver.resume(),
      onPause: () => {
        this.saveSnapshot();
        // Pause returns to the hub: novel is no longer actively running.
        markNovelSessionEnded();
        this.switchToNovelSelector();
      },
      onLeaveNovel: () => {
          novelStateStore.clear(this.novel.name);
          markNovelSessionEnded();
          this.switchToNovelSelector();
      },
      onFinish: () => {
        if(this.eventResolver.tracking) setCompletedFlag(this.eventResolver.storageKey, this.eventResolver.getCurrentEventId(), true);
        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: {
            scene : `${this.eventResolver.tracking ? "completion-scene" : "novel-selector-scene"}`,
            args: {
              novelName: this.novel.name,
              dialogueText: this.eventResolver.getDialogueTranscript(),
              storageKey: this.eventResolver.storageKey
            } 
          },
          bubbles : true
        }))
      }
    });

    this.undoChoicePopUp = createUndoChoicePopUp(this.novel, {
      onResume: () => {
        this.pendingUndo = null;
        this.eventResolver.resume();
      },
      onUndo: () => {
        if (!this.pendingUndo) return;
        const { index, bubble } = this.pendingUndo;
        this.pendingUndo = null;
        this.dialogueList.undoToChoice(bubble);
        this.eventResolver.undoChoice(index);
      }
    });
    
    const header = document.createElement(needBaseHeader ? "base-header" : "back-header");
    if(!needBaseHeader) {
      header.addEventListener('sm-back', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        this.eventResolver.pause();
        this.pausePopUp.toggle(true);
      });
    }

    // Add ChildElements to DOM
    this.appendChild(this.eventResolver);
    this.appendChild(header);
    this.appendChild(this.background);

    this.addInteractiveObjects();

    this.background.appendChild(this.dialogueList);
    this.appendChild(this.pausePopUp);
    this.appendChild(this.undoChoicePopUp);

    // Saving a snapshot on an attemt to leave the scene
    const leavingFunctions = [header.querySelector("#btn-legal"), header.querySelector("#btn-settings")];
    leavingFunctions.forEach((element) => {
      const originalFunction = element.onclick;
      element.onclick = (...args) => {
        this.saveSnapshot();
        return originalFunction.apply(this, args);
      };
    });

    

    const hasSavedState = shouldShowContinuePopUp(this.novel.name);

    if(!!this.args.snapshot) {

      this.loadSnapshot();

    } else if (!isIntroNovel(this.novel) && hasSavedState) {

      // on continue läuft beim weiterspielen nach dem continue pop up
      // Hier wird der davor gespeicherte snapshot aus dem store geladen und wieder in den resolver übertragen
      this.continuePopUp = createContinuePopUp(this.novel, {
        onContinue: async () => {
          this.loadSnapshot();
        },
        onRestart: () => {
          novelStateStore.clear(this.novel.name); // Alten State löschen
          this.eventResolver.currentEvent = this.novel["novelEvents"][0];
          this.resolveEvent();
        },
      });
      this.appendChild(this.continuePopUp);
      this.continuePopUp.toggle(true);

    } else {
      this.resolveEvent();
    }

    attachDialogueSkipOnOutsideClick(this.background, this.dialogueList);

    playAudio("SFX_LoadScene");
  }

  requestUndoChoice({ index, bubble }) {
    if (typeof index !== "number" || !bubble) return;
    this.pendingUndo = { index, bubble };
    this.eventResolver.pause();
    this.undoChoicePopUp.toggle(true);
  }

  /** Navigates back to the novel selector hub. */
  switchToNovelSelector() {
    this.dispatchEvent(
      new CustomEvent("sm-switch-scene", {
        detail: { scene: "novel-selector-scene" },
        bubbles: true,
      }),
    );
  }

  /** Prompts the event resolver to process the current novel event. */
  resolveEvent() {
    this.dispatchEvent(
      new CustomEvent("resolve-event", {
        bubbles: true,
      }),
    );
  }

  /** Builds the background div from the novel's background image. */
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

  /**
   * Loads the interactive objects for this novel and appends them to the background.
   * @returns {Promise<void>}
   */
  async addInteractiveObjects() {
    const interactiveObjectData = await fetchFromJson("assets/json/interactive-objects-info.json");
    this.background.appendChild(InteractiveObjects.create(interactiveObjectData.visualNovels.find((element) => element.name == this.novel['name']).interactiveObjects));
  }

  /**
   * Rebuilds the UI (characters, messages) from a saved event history when continuing a novel.
   * @param {Array<Object>} history The past events to replay.
   * @returns {Promise<void>}
   */
  async restoreVisualState(history) {
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

  /**
   * Saves the current resolver state to the store so the novel can be resumed later
   */
  saveSnapshot() {
    const snapShot = this.eventResolver.getSnapshot();
    if (snapShot) {
      this.args.snapshot = snapShot
      novelStateStore.save(this.novel.name, snapShot);
    }
  }

  /**
   * Restores a saved snapshot into the resolver, rebuilds the visual state and resumes play.
   * @returns {Promise<void>}
   */
  async loadSnapshot() {
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
  }
}

customElements.define("novel-scene", NovelScene);
