import { playAudio, TTSRead } from "../../shared-services/audio-playing-service.js";
import { addDialogChoice, newNovelInfo, setCompletedFlag, truncateDialogChoices } from "../../shared-services/progress-tracking-service.js";
import { EVENT_TYPES } from "../../shared-services/mapping-service.js";
import { fetchFromJson } from "../../shared-services/fetch-service.js";

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

  // True while an event chain (see resolveCurrentEvent/eventLoop) is running.
  // Prevents a second chain from being started while the first one is still
  // awaiting an animation - such a parallel chain would duplicate messages.
  chainRunning = false;

  // Promise of the currently running chain, used by undoChoice to restart the
  // dialogue after the previous chain has unwound.
  activeChain = null;

  // Incremented whenever the resolver state is rewound (undo) or replaced
  // (snapshot load), so chains still in flight can detect they are stale.
  runId = 0;

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
    if (this.chainRunning) {
      // A chain is already running; it will continue the dialogue on its own.
      return;
    }
    this.chainRunning = true;
    const promise = (async () => {
      try {
        await this.eventLoop();
      } finally {
        this.chainRunning = false;
      }
    })();
    this.activeChain = promise;
    return promise;
  }

  /**
   * Processes the current event, then the next one, until the chain reaches a
   * stopping point (choices shown, character added, novel ended, pause).
   */
  async eventLoop() {
    const runId = this.runId;

    let allCharacters = Array.from(this.parentNode.querySelectorAll('character-box'));
    let character = this.parentNode.querySelector(`#character-${this.currentEvent['character']}`)
    allCharacters.filter(c => c != character || this.currentEvent['eventType'] != EVENT_TYPES.showMessage).forEach(c => c.setSpeakingState(false));
    if(character) character.updateCharacterExpression(this.currentEvent['expressionType']);

    // Speichern der messages und characters in den storage um diese beim weiterspielen wieder anzuzeigen
    if ([EVENT_TYPES.showMessage, EVENT_TYPES.characterJoin, EVENT_TYPES.markBias].includes(this.currentEvent['eventType'])) {
      this.eventHistory.push(this.currentEvent);
    }

    switch(this.currentEvent['eventType']) {

      case EVENT_TYPES.characterJoin:
        await this.addCharacter();
        return;

      case EVENT_TYPES.characterExit:
        break;

      case EVENT_TYPES.showMessage:
        if(character) character.setSpeakingState(true);
        TTSRead(this.currentEvent['text']);
        await this.dialogueList.showMessage(this.currentEvent['text'], false, this.currentEvent['character']);
        // A stale chain (undo/snapshot while the message was showing) must not
        // clear the choices that were restored in the meantime.
        if (runId !== this.runId) {
          return;
        }
        this.currentChoices = [];
        break;

      case EVENT_TYPES.addChoice:
        this.currentChoices.push(this.currentEvent);
        break;

      case EVENT_TYPES.showChoices:
        TTSRead("Folgende Antwortmöglichkeiten stehen dir zur Auswahl: " + this.currentChoices.map((element, index) => {
          return `${index+1}. Option: ${element['text']} `
        }).join(""));
        await this.dialogueList.showChoices(this.currentChoices);
        return;

      case EVENT_TYPES.endNovel:
        if(this.tracking) setCompletedFlag(this.storageKey, this.currentEvent['id'], false);
        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: {
            scene : `${this.tracking ? "completion-scene" : "novel-selector-scene"}`,
            args: {
              novelName: this.novelName,
              dialogueText: await this.getDialogueTranscript(),
              storageKey: this.storageKey
            }
          },
          bubbles : true
        }));

        // Event zum löschen des storage nachdem das novel vorbei ist
        this.dispatchEvent(new CustomEvent("novel-finished", {
          bubbles : true,
        }));

        return;

      case EVENT_TYPES.playSound:
        playAudio(this.currentEvent.audioClipToPlay);
        break;

      case EVENT_TYPES.markBias:
        break;

      default:
        console.warn(`Unknown event with Id ${this.currentEvent['id']}`);
    }

    if (runId !== this.runId) {
      return;
    }

    // Pause gate: hold the chain here while the pause popup is open. The chain
    // resumes on its own once unpause()d, instead of a second chain being
    // started in parallel (which would duplicate messages).
    while (this.isPaused && runId === this.runId) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (runId !== this.runId) {
      return;
    }

    this.switchToNext();
    await this.eventLoop();
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

    if (this.isPaused) {
      console.warn("Ignoring user confirmation while paused.");
      return;
    }

    const runId = this.runId;
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
        character: 1,
        // Marks this history entry as a player answer, so a restored session
        // can rebuild it as a clickable (undoable) choice bubble.
        isUserChoice: true
      });
    }

    if(this.tracking) addDialogChoice(this.storageKey, choice.detail["choiceIndex"]);
    this.switchTo(this.currentChoices[choice['detail']['choiceIndex']]['onChoice']);
    this.currentChoices = [];

    if (runId !== this.runId) {
      return;
    }

    while (this.isPaused && runId === this.runId) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (runId !== this.runId) {
      return;
    }

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

    // Stop a message animation that may still be running (the chain awaiting it
    // must unwind before the restored choices can be shown).
    this.dialogueList.cancelActiveMessage?.();

    // Invalidate chains still in flight: the runId change makes them stop at
    // their next checkpoint instead of advancing past the restored state.
    this.runId++;
    this.isPaused = false;

    // Restart at the restored choice point once the previous chain has
    // fully unwound (eventType 6 will show the choices again).
    const previous = this.activeChain;
    const start = () => this.resolveCurrentEvent();
    if (previous) {
      previous.then(start, start);
    } else {
      start();
    }
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
      // If a chain is still running (paused mid-message), it continues on its
      // own at its pause gate. Only restart explicitly if none is running.
      if (!this.chainRunning) {
        this.resolveCurrentEvent();
      }
    }
  }

  /**
   * Gets the Id of the current Event
   * @returns Id of the current event
   */
  getCurrentEventId() {
    return this.currentEvent ? this.currentEvent['id'] : null;
  }

  async getDialogueTranscript() {
    const data = await fetchFromJson("assets/json/character-info.json");
    const nameById = Object.fromEntries(data["characters"].map((c) => [c.id, c.name]));
    return this.eventHistory
        .filter((e) => [EVENT_TYPES.showMessage, EVENT_TYPES.markBias].includes(e.eventType) && (e.text || e.relevantBias))
        .map((e) => {
          if (e.eventType === EVENT_TYPES.markBias) return `(Hinweis: Bias ${e.relevantBias})`;
          return e.character === 1 ? `Du: ${e.text}` : `${nameById[e.character] || "Unbekannt"}: ${e.text}`;
        })
        .join("\n");
  }

  /**
   * Loads the given snapshot
   * @param {*} snapShot 
   */
  loadSnapshot(snapShot) {
    if (snapShot && snapShot.eventId) {
      // Copies (not live references): the resolver mutates these arrays while
      // playing (choices, undo); sharing identity with the stored snapshot
      // object would silently rewrite the saved state.
      this.eventHistory = (snapShot.history || []).map((e) => ({ ...e }));
      this.currentChoices = (snapShot.currentChoices || []).map((c) => ({ ...c }));
      this.choicePoints = (snapShot.choicePoints || []).map((cp) => ({
        ...cp,
        choices: (cp.choices || []).map((c) => ({ ...c })),
      }));

      if (snapShot.storageKey) {
          this.storageKey = snapShot.storageKey;
      }

      this.switchTo(snapShot.eventId);
      // Any chain started before the snapshot load is now stale.
      this.runId++;
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
