export class EventResolver extends HTMLElement {

  characterBox;
  dialogueList;

  events = {};
  currentEvent = {};
  currentChoices = [];

  static create(events, dialogueList) {
    const eventResolver = document.createElement('event-resolver');
    eventResolver.events = events;
    eventResolver.dialogueList = dialogueList;
    return eventResolver
  }

  connectedCallback() {
    this.currentEvent = this.events[0]
  }

  async resolveCurrentEvent() {

    console.log("Resolving Event: " + this.currentEvent['eventType']);

    let allCharacters = Array.from(this.parentNode.querySelectorAll('character-box'));
    console.log(allCharacters);
    let character = this.parentNode.querySelector(`#character-${this.currentEvent['character']}`)
    allCharacters.filter(c => c != character || this.currentEvent['eventType'] != 4).forEach(c => c.setSpeakingState(false));
    if(character) character.updateCharacterExpression(this.currentEvent['expressionType']);

    switch(this.currentEvent['eventType']) {

      case 2: //Character Join Event
        console.log("Character Join Event");
        await this.addCharacter();
        return;

      case 3: //Character Exit Event
        console.log("Character Exit Event");
        break;

      case 4: //Show Message Event
        if(character) character.setSpeakingState(true);
        await this.dialogueList.showMessage(this.currentEvent['text'], false,  this.currentEvent['character']);
        break;

      case 5: //Add Choice Event
        this.currentChoices.push(this.currentEvent);
        break;

      case 6: //Show Choices Event
        await this.dialogueList.showChoices(this.currentChoices);
        return;

      case 10: //Gpt Promt Event
        console.log("GPT Promt Event");
        await new Promise(r => setTimeout(r, 4000));
        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
          detail: {
            scene : "novel-selector"
          },
          bubbles : true
        }));
        return;

      case 11: //Save Persistent Event
        console.log("Save Persistent Event");
        break;

      case 1: //Set Background Event (This case does not exist)
      case 7: //End Novel Event (This case does not exist)
      case 8: //Play Sound Event (This case does not exist)
      case 9: //Play Animation Event (This case does not exist)
      case 12: //Mark Bias Event (This case does not exist)
      case 13: //Save Variable Event (This case does not exist)
      case 14: //Add Feedback Event (This case does not exist)
      case 16: //???
      default:
        console.log(`Unknown event with Id ${this.currentEvent['id']}`);
    }
    this.switchToNext();
    await this.resolveCurrentEvent();
  }

  async userConfirmation(choice) {
    // Only accept user Confirmation, if the current event is 
    if(this.currentEvent['eventType'] != 6) {
      console.log(`Invalid State --- novel-scene.userConfirmation ${this.currentEvent['eventType']}`);
      return;
    }
    
    console.log(this.currentChoices);
    console.log(choice);
    this.switchTo(this.currentChoices[choice['detail']['choiceIndex']]['onChoice']);
    
    this.currentChoices = [];
    await this.resolveCurrentEvent();

  }

  async addCharacter() {
    if(this.currentEvent['eventType'] != 2) throw "Invalid Event Type"
    this.dispatchEvent(new CustomEvent("add-character", {
      detail : {
        characterId : this.currentEvent['character']
      },
      bubbles : true
    }));
  }

  addCharacterCallback() {
    if(this.currentEvent['eventType'] != 2) throw "Invalid Event Type"
    this.switchToNext();
    this.resolveCurrentEvent();
  }

  switchToNext() {
    this.switchTo(this.currentEvent['nextId']);
  }

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
}
customElements.define('event-resolver', EventResolver);