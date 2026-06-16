import { playAudio } from "../../shared-services/audio-playing-service.js";

export class InteractiveObjects extends HTMLElement {

  data;

  /**
   * Creates a new InteractiveObjects element.
   * @param {*} interactiveObjectsData the data for all interactive Objects in this novel
   * @returns The newly created element
   */
  static create(interactiveObjectsData) {
    const newInteractiveObjects = document.createElement('interactive-objects');
    newInteractiveObjects.data = interactiveObjectsData;
    return newInteractiveObjects;
  }

  connectedCallback() {
    // 1. Check, whether the novel even has Interactive Objects
    if (!this.data || this.data.length === 0) {
      return; 
    }
    
    this.id = 'interactive-objects';
    this.className = 'absolute w-full h-full pointer-events-none';

    this.data.forEach(objConfig => {
      
      const imgObj = document.createElement('img');
      imgObj.id = `obj-${objConfig.id}`;
      imgObj.src = objConfig.states[objConfig.currentState];
      imgObj.draggable = false;
      
      imgObj.className = `${objConfig.classes} absolute transition-opacity duration-300`;
      
      imgObj.style.left = `${objConfig.x / 10}cqw`;

      if (typeof objConfig.y === 'number') {
        imgObj.style.top = `${objConfig.y / 10}cqw`;
      }
      
      imgObj.style.width = `${objConfig.width / 10}cqw`;
      imgObj.style.height = `${objConfig.height / 10}cqw`;
      
      imgObj.style.zIndex = objConfig.zIndex;

      const stateKeys = Object.keys(objConfig.states);
      
      if (stateKeys.length > 1) {
        
        imgObj.addEventListener('click', async (e) => {
          
          // Animation lock: Prevents flickering through spam-clicking
          if (imgObj.isAnimating) return;

          switch (objConfig.interaction) {
            case "sequence":
              imgObj.isAnimating = true;

              if(objConfig.sound) {
                playAudio(objConfig.sound);
              }

              for (let i = 1; i < stateKeys.length; i++) {
                objConfig.currentState = stateKeys[i];
                imgObj.src = objConfig.states[objConfig.currentState];
                
                await new Promise(resolve => setTimeout(resolve, 400));
              }

              await new Promise(resolve => setTimeout(resolve, 400));

              objConfig.currentState = stateKeys[0];
              imgObj.src = objConfig.states[objConfig.currentState];

              imgObj.isAnimating = false;

              break;
            case "toggle":
              const currentIndex = stateKeys.indexOf(objConfig.currentState);
              const nextIndex = (currentIndex + 1) % stateKeys.length; 
              
              objConfig.currentState = stateKeys[nextIndex];
              imgObj.src = objConfig.states[objConfig.currentState];

              if(objConfig.sounds && objConfig.sounds[objConfig.currentState]) {
                playAudio(objConfig.sounds[objConfig.currentState]);
              }
              break;
            default:
              console.warn("Unknown Interaction " + objConfig.interaction);
          }
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