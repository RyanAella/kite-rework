import { playAudio, TTSRead } from "../../shared-services/audio-playing-service.js";
import { addDialogChoice, newNovelInfo, setCompletedFlag, truncateDialogChoices } from "../../shared-services/progress-tracking-service.js";

export class EventResolver extends HTMLElement {

  novelName;
  characterBox;
  dialogueList;
  tracking;

  events = {};
  currentEvent = {};
  currentChoices = [];
  storageKey;
  eventHistory = [];
  choicePoints = [];

  isPaused = false;

  static create(novelName, events, dialogueList, tracking) {
    const eventResolver = document.createElement('event-resolver');
    eventResolver.events = events;
    eventResolver.dialogueList = dialogueList;
    eventResolver.novelName = novelName;
    eventResolver.tracking = tracking;
    return eventResolver;
  }

  connectedCallback() {
    this.currentEvent = this.events[0];
    if(this.tracking) this.storageKey = newNovelInfo(this.novelName);
  }

  /**
   * Resolves the Current Event and switches to the next one.
   */
  async resolveCurrentEvent() {
    if(this.isPaused) {
      console.warn("Dialogue is in paused state.");
      return;
    }

    let allCharacters = Array.from(this.parentNode.querySelectorAll('character-box'));
    let character = this.parentNode.querySelector(`#character-${this.currentEvent['character']}`)
    allCharacters.filter(c => c != character || this.currentEvent['eventType'] != 4).forEach(c => c.setSpeakingState(false));
    if(character) character.updateCharacterExpression(this.currentEvent['expressionType']);

    // Speichern der messages und characters in den storage um diese beim weiterspielen wieder anzuzeigen
    if (this.currentEvent['eventType'] === 4 || this.currentEvent['eventType'] === 2) {
        this.eventHistory.push(this.currentEvent);
    }

    switch(this.currentEvent['eventType']) {

      case 2: //Character Join Event
        await this.addCharacter();
        return;

      case 3: //Character Exit Event
        break;

      case 4: //Show Message Event
        if(character) character.setSpeakingState(true);
        TTSRead(this.currentEvent['text']);
        await this.dialogueList.showMessage(this.currentEvent['text'], false, this.currentEvent['character']);
        break;

      case 5: //Add Choice Event
        this.currentChoices.push(this.currentEvent);
        break;

      case 6: //Show Choices Event
        TTSRead("Folgende Antwortmöglichkeiten stehen dir zur Auswahl: " + this.currentChoices.map((element, index) => {
          return `${index+1}. Option: ${element['text']} `
        }).join(""));
        await this.dialogueList.showChoices(this.currentChoices);
        return;

      case 10: //Gpt Promt Event
        await new Promise(r => setTimeout(r, 4000));
        if(this.tracking) setCompletedFlag(this.storageKey, this.currentEvent['id'], false);
        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: {
            scene : `${this.tracking ? "completion-scene" : "novel-selector-scene"}`,
            args: {
              novelName: this.novelName
            } 
          },
          bubbles : true
        }));

        // Event zum löschen des storage nachdem das novel vorbei ist
        this.dispatchEvent(new CustomEvent("novel-finished", {
          bubbles : true
        }));

        return;

      case 11: //Play Sound Event
        playAudio(this.currentEvent.audioClipToPlay);
        break;

      case 16: //Bias Event
        break;
        
      case 1: //Set Background Event (This case does not exist)
      case 7: //End Novel Event (This case does not exist)
      case 8: //Save Persistent Event (This case does not exist)
      case 9: //Play Animation Event (This case does not exist)
      case 12: //Mark Bias Event (This case does not exist)
      case 13: //Save Variable Event (This case does not exist)
      case 14: //Add Feedback Event (This case does not exist)
      default:
        console.warn(`Unknown event with Id ${this.currentEvent['id']}`);
    }

    if(this.isPaused) {
      return;
    }

    this.switchToNext();
    await this.resolveCurrentEvent();
  }

  /**
   * Handles the user confirmation of a choice.
   * @param {Object} choice - The choice object containing the choice index.
   */
  async userConfirmation(choice) {
    // Only accept user Confirmation, if the current event is 
    if(this.currentEvent['eventType'] != 6) {
      console.error(`Invalid State --- novel-scene.userConfirmation ${this.currentEvent['eventType']}`);
      return;
    }

    const choiceIndex = choice['detail']['choiceIndex'];

    // Save the current state of the event history and choices
    const historyLength = this.eventHistory.length;
    this.choicePoints.push({
      choicesEventId: this.currentEvent?.id,
      choices: [...this.currentChoices],
      historyLength,
    });

    if (this.currentChoices[choiceIndex]) {
      const selectedChoiceText = this.currentChoices[choiceIndex].text;
      this.eventHistory.push({
        eventType: 4,     
        text: selectedChoiceText,
        character: 1
      });
    }

    if(this.tracking) addDialogChoice(this.storageKey, choice.detail["choiceIndex"]);
    this.switchTo(this.currentChoices[choice['detail']['choiceIndex']]['onChoice']);
    this.currentChoices = [];

    if (this.isPaused) return;
    await this.resolveCurrentEvent();

  }

  /**
   * Undoes a choice by restoring the previous state of the event history and choices.
   * @param {number} index - The index of the choice point to undo.
   * @returns {Object|null} The choice point that was undone, or null if no choice point was found.
   */
  undoChoice(index) {
    const cp = this.choicePoints[index];
    if (!cp) return null;

    // Drop this and all later choice points.
    this.choicePoints.length = index;

    // Trim history back to before this choice was selected.
    this.eventHistory.length = cp.historyLength;

    // Restore the choice event and its choices.
    this.currentChoices = [...(cp.choices || [])];
    this.switchTo(cp.choicesEventId);

    if (this.tracking) {
      truncateDialogChoices(this.storageKey, index);
    }

    this.isPaused = false;
    this.resolveCurrentEvent(); // eventType 6 will show choices again
    return cp;
  }

  /**
   * Sends an event to the NovelScene to add a new Character
   */
  async addCharacter() {
    if(this.currentEvent['eventType'] != 2) throw "Invalid Event Type"
    const characterId = this.currentEvent['character'];
    this.dispatchEvent(new CustomEvent("add-character", {
      detail : {
        characterId : characterId,
      },
      bubbles : true
    }));
  }

  /**
   * Recieves Confirmation, that the Character has been added and proceeds with the next event
   */
  addCharacterCallback() {
    if(this.currentEvent['eventType'] != 2) throw "Invalid Event Type"
    this.switchToNext();
    if (this.isPaused) return;
    this.resolveCurrentEvent();
  }

  /**
   * Switches to the next event.
   */
  switchToNext() {
    this.switchTo(this.currentEvent['nextId']);
  }

  /**
   * Switches to a different event
   * @param {*} id The ID of the event switched to
   * @returns true, if the event has been found and false otherwise
   */
  switchTo(id) {
    let events = this.events;
    for(let i = 0; i < events.length; i++) {
      if(events[i]['id'] === id) {
        this.currentEvent = events[i];
        return true;
      }
    }
    return false;
  }

  /**
   * Pauses the Event Loop to stop the dialog from continuing
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resumes the dialogue, after it has been paused
   */
  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      // Startet die Schleife wieder exakt dort, wo sie gestoppt hat
      this.resolveCurrentEvent(); 
    }
  }

  /**
   * Gets the Id of the current Event
   * @returns Id of the current event
   */
  getCurrentEventId() {
    return this.currentEvent ? this.currentEvent['id'] : null;
  }

  /**
   * Loads the given snapshot
   * @param {*} snapShot 
   */
  loadSnapshot(snapShot) {
    if (snapShot && snapShot.eventId) {
      this.eventHistory = snapShot.history || [];
      this.currentChoices = snapShot.currentChoices || [];
      this.choicePoints = snapShot.choicePoints || [];

      if (snapShot.storageKey) {
          this.storageKey = snapShot.storageKey;
      }

      this.switchTo(snapShot.eventId);
    }
  }

  /**
   * Generates a snapshot of the current state of the novel.
   * @returns the snapshot
   */
  getSnapshot() {
    return {
      eventId: this.currentEvent ? this.currentEvent['id'] : null,
      history: this.eventHistory,
      currentChoices: this.currentChoices,
      choicePoints: this.choicePoints,
      storageKey: this.storageKey
    };
  }
}

customElements.define('event-resolver', EventResolver);