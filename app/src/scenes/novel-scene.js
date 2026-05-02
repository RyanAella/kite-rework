import "../shared-components/dialogue-list.js";
import "../shared-components/headers/back-header.js";
import "../shared-components/headers/base-header.js";

class NovelScene extends HTMLElement {
  
  constructor() {
    super();
    this.dialogueList = document.createElement("dialogue-list");
    this.dialogueList.classList.add("h-1/2", "shrink-0", "flex", "flex-col", "w-full", "overflow-hidden", "relative", "z-50");
  }

  novel = {};
  currentEvent = {};
  currentChoices = [];
  dialogueList;

  connectedCallback() {
    this.novel = this.args['novel']
    let flag = this.args['needBaseHeader'];
    
    //Event Setup
    this.addEventListener("user-confirmation", (event) => { this.userConfirmation(event)});

    this.classList.add("flex", "flex-col", "items-center", "justify-center", "w-full", "h-full", "bg-blue-50/30", "font-sans", "overflow-hidden");

    console.log(this.dialogueList);

    console.log(this.novel);

    let events = this.novel['novelEvents'];
    this.currentEvent = events[0];

    if(flag) {
      const header = document.createElement("base-header");
      this.prepend(header);
    } else {
      const header = document.createElement("back-header");
      this.prepend(header);
    }

    this.createBackground();

    document.getElementById('background').appendChild(this.dialogueList);

    this.renderInteractiveObjects();

    this.resolveCurrentEvent();
  }

  createBackground() {
    const backgroundImageFileName = this.novel['name'] + '_BG.png';
    const backgroundImage = new Image();
    backgroundImage.src = 'assets/Images/Background/' + backgroundImageFileName;
    const background = document.createElement('div');
    background.style.backgroundImage = 'url(' + backgroundImage.src + ')';
    background.id = 'background';
    background.classList.add("pointer-events-auto", "bg-[length:100%_100%]", "bg-no-repeat", "bg-center", "flex-1", "w-full", "flex", "flex-col", "justify-start", "overflow-hidden", "relative", "z-0");
    this.appendChild(background);
  }

  async resolveCurrentEvent() {
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
        await this.dialogueList.showMessage(this.currentEvent['text'], false,  this.currentEvent['character']);
        break;
      case 5: //Add Choice Event
        this.currentChoices.push(this.currentEvent);
        break;
      case 6: //Show Choices Event
        await this.dialogueList.showChoices(this.currentChoices);
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

  renderInteractiveObjects() {
    // 1. Prüfen, ob die Novel überhaupt Objekte definiert hat
    if (!this.novel['interactiveObjects'] || this.novel['interactiveObjects'].length === 0) {
      console.log("Novel has no interactive objects defined");
      return; 
    }

    // 2. Einen Container erschaffen, der über dem Hintergrund, aber unter dem UI liegt
    const objectContainer = document.createElement('div');
    objectContainer.id = 'interactive-objects-layer';
    // pointer-events-none ist wichtig, damit Klicks ins Leere an den Hintergrund durchgereicht werden
    objectContainer.className = 'absolute inset-0 w-full h-full pointer-events-none z-10';

    // 3. Jedes Objekt aus der JSON iterieren und rendern
    this.novel['interactiveObjects'].forEach(objConfig => {
      
      const imgObj = document.createElement('img');
      imgObj.id = `obj-${objConfig.id}`;
      imgObj.src = objConfig.states[objConfig.currentState];
      imgObj.draggable = false;
      
      // Das Objekt selbst muss wieder klickbar sein (pointer-events-auto)
      imgObj.className = `${objConfig.classes} absolute transition-opacity duration-300`;
      
      // Die etablierte Mathematik: 1000er Pixelwerte in cqw umrechnen
      imgObj.style.left = `${objConfig.x / 10}cqw`;

      if (typeof objConfig.y === 'number') {
        console.log("y does not equal null");
        imgObj.style.top = `${objConfig.y / 10}cqw`;
      }
      
      imgObj.style.width = `${objConfig.width / 10}cqw`;
      imgObj.style.height = `${objConfig.height / 10}cqw`;
      
      // Z-Index steuert, ob es hinter Charakteren (z.B. 10) oder im Vordergrund (z.B. 30) liegt
      imgObj.style.zIndex = objConfig.zIndex;

      // 4. Klick-Logik: Nur anbinden, wenn es mehr als einen Zustand gibt
      const stateKeys = Object.keys(objConfig.states);
      
      if (stateKeys.length > 1) {
        
        imgObj.addEventListener('click', async (e) => {
          e.stopPropagation(); 
          
          // Animations-Lock: Verhindert Flackern durch Spam-Klicks
          if (imgObj.isAnimating) return;

          if (objConfig.interaction === "sequence") {
            
            imgObj.isAnimating = true;

            // Wir starten bei Index 1, da Index 0 das "idle" Bild ist, das wir schon sehen
            for (let i = 1; i < stateKeys.length; i++) {
              console.log("steaming...")
              objConfig.currentState = stateKeys[i];
              imgObj.src = objConfig.states[objConfig.currentState];
              
              // Delay: Pausiert die Schleife für 200 Millisekunden pro Bild
              // (Passen Sie die 200 an, um die Animation schneller oder langsamer zu machen)
              await new Promise(resolve => setTimeout(resolve, 400));
            }

            // Noch ein kurzes Delay auf dem letzten Frame, bevor es verschwindet
            await new Promise(resolve => setTimeout(resolve, 400));

            // Am Ende wieder zurück zum neutralen Anfangszustand (idle)
            objConfig.currentState = stateKeys[0];
            imgObj.src = objConfig.states[objConfig.currentState];

            // Lock wieder aufheben
            imgObj.isAnimating = false;

          } else {
            // STANDARD-TOGGLE LOGIK (z.B. für die Lampe)
            const currentIndex = stateKeys.indexOf(objConfig.currentState);
            const nextIndex = (currentIndex + 1) % stateKeys.length; 
            
            objConfig.currentState = stateKeys[nextIndex];
            imgObj.src = objConfig.states[objConfig.currentState];
          }
          
          console.log(`Objekt ${objConfig.id} wechselt zu Zustand: ${objConfig.currentState}`);
        });
      }

      objectContainer.appendChild(imgObj);
    });

    // Den fertigen Container in den Hintergrund der Szene einhängen
    const bgElement = this.querySelector('#background');
    bgElement.appendChild(objectContainer);
  }

}



customElements.define("novel-scene", NovelScene);

