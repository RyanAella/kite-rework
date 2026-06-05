import { playAudio } from "../../shared-services/audio-playing-service.js";

export class InteractiveObjects extends HTMLElement {

  data;

  static create(interactiveObjectsData) {
    console.log(interactiveObjectsData);
    const newInteractiveObjects = document.createElement('interactive-objects');
    newInteractiveObjects.data = interactiveObjectsData;
    return newInteractiveObjects;
  }

  connectedCallback() {
    this.renderInteractiveObjects();
  }

  renderInteractiveObjects() {
    // 1. Prüfen, ob die Novel überhaupt Objekte definiert hat
    if (!this.data || this.data.length === 0) {
      console.log("Novel has no interactive objects defined");
      return; 
    }
    
    this.id = 'interactive-objects';
    // pointer-events-none ist wichtig, damit Klicks ins Leere an den Hintergrund durchgereicht werden
    this.className = 'absolute w-full h-full pointer-events-none';

    // 3. Jedes Objekt aus der JSON iterieren und rendern
    this.data.forEach(objConfig => {
      
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
          
          // Animations-Lock: Verhindert Flackern durch Spam-Klicks
          if (imgObj.isAnimating) return;

          switch (objConfig.interaction) {
            case "sequence":
              imgObj.isAnimating = true;

              if(objConfig.sound) {
                playAudio(objConfig.sound);
              }

              // Wir starten bei Index 1, da Index 0 das "idle" Bild ist, das wir schon sehen
              for (let i = 1; i < stateKeys.length; i++) {
                console.log("Playing Animation ...")
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

              break;
            case "toggle":
              // STANDARD-TOGGLE LOGIK (z.B. für die Lampe)
              const currentIndex = stateKeys.indexOf(objConfig.currentState);
              const nextIndex = (currentIndex + 1) % stateKeys.length; 
              
              objConfig.currentState = stateKeys[nextIndex];
              imgObj.src = objConfig.states[objConfig.currentState];

              if(objConfig.sounds && objConfig.sounds[objConfig.currentState]) {
                playAudio(objConfig.sounds[objConfig.currentState]);
              }
              break;
            default:
              console.log("Unknown Interaction " + objConfig.interaction);
          }
          
          console.log(`Objekt ${objConfig.id} wechselt zu Zustand: ${objConfig.currentState}`);
        });
      }

      if(objConfig.syncToCharacter) {
        this.dispatchEvent(new CustomEvent("sync-object-to-character", {
          detail: {
            object: imgObj,
            characterId : objConfig.syncToCharacter
          },
          bubbles: true
        }));
      }

      this.appendChild(imgObj);
    });
  }
}

customElements.define("interactive-objects", InteractiveObjects);