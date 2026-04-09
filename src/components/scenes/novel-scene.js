import "../dialogue-list.js"
import "../headers/back-header.js"

class NovelScene extends HTMLElement {
  
  constructor() {
    super();
    this.dialogueList = document.createElement("dialogue-list");
    this.dialogueList.classList.add("h-screen");
  }

  novel = {};
  currentEvent = {};
  currentChoices = [];

  dialogueList;

  connectedCallback() {
    this.novel = this.args['novel']
    
    //Event Setup
    this.addEventListener("user-confirmation", (event) => { this.userConfirmation(event)});

    this.classList.add("flex", "flex-col", "items-center", "justify-center", "min-h-screen", "bg-blue-50/30", "font-sans");

    console.log(this.dialogueList);

    console.log(this.novel);

    let events = this.novel['novelEvents'];
    this.currentEvent = events[0];

    const header = document.createElement("back-header");
    this.prepend(header);

    this.createBackground();

    document.getElementById('#background').appendChild(this.dialogueList);

    this.resolveCurrentEvent();
  }

  createBackground() {
    const backgroundImageFileName = this.novel['name'] + '_BG.png';
    const backgroundImage = new Image();
    backgroundImage.src = 'assets/Images/Background/' + backgroundImageFileName;
    const background = document.createElement('div');
    background.style.backgroundImage = 'url(' + backgroundImage.src + ')';
    background.id = '#background';
    background.classList.add("pointer-events-auto", "bg-[url("+ backgroundImage.src +"]", "bg-cover", "bg-center", "min-h-64");
    this.appendChild(background);
  }

  resolveCurrentEvent() {
    switch(this.currentEvent['eventType']) {
      case 1: //Set Background Event

        // This case does not exist
        break;

      case 2: //Character Join Event
        console.log("Character Join Event");
        break;
      case 3: //Character Exit Event

        console.log("Character Exit Event");
        break;

      case 4: //Show Message Event
        this.dialogueList.showMessage(this.currentEvent['text']);
        break;
      case 5: //Add Choice Event
        this.currentChoices.push(this.currentEvent);
        break;
      case 6: //Show Choices Event
        this.dialogueList.showChoices(this.currentChoices);
        return;
      case 7: //End Novel Event

        // This case does not exist
        break;

      case 8: //Play Sound Event

        // This case does not exist
        break;

      case 9: //Play Animation Event

        // This case does not exist
        break;

      case 10: //Gpt Promt Event

        console.log("GPT Promt Event");
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

      case 12: //Mark Bias Event

        // This case does not exist

      case 13: //Save Variable Event

        // This case does not exist

      case 14: //Add Feedback Event

        // This case does not exist
      
      case 16: //???

      default:
        console.log(`Unknown event with Id ${this.currentEvent['id']}`);
    }
    this.nextNovel();
    this.resolveCurrentEvent();
  }


  userConfirmation(choice) {
    // Only accept user Confirmation, if the current event is 
    if(this.currentEvent['eventType'] != 6) {
      console.log(`Invalid State --- novel-scene.userConfirmation ${this.currentEvent['eventType']}`);
      return;
    }
    
    console.log(this.currentChoices);
    console.log(choice);
    this.switchTo(this.currentChoices[choice['detail']['choiceIndex']]['onChoice']);
    
    this.currentChoices = [];
    this.resolveCurrentEvent();

  }

  
  nextNovel() {
    this.switchTo(this.currentEvent['nextId']);
  }

  switchTo(id) {
    let events = this.novel['novelEvents'];
    for(let i = 0; i < events.length; i++) {
      if(events[i]['id'] === id) {
        this.currentEvent = events[i];
        return true;
      }
    }
    return false;
  }

}



customElements.define("novel-scene", NovelScene);

