const skinSprites = ['a','b','c','d'];
const headSpriteCount = 2;

class CharacterBox extends HTMLElement {
  

  novel;

  connectedCallback() {
    this.classList.add("absolute", "w-[75cqw]", "grid", "z-30");
    this.style.top = `${100}cqw`;
    this.style.left = `${10}cqw`
  }
  
  blinkAnimationOrder = {0:"Eyes_Open", 1:"Eyes_Half_Open", 2:"Eyes_Closed", 3:"Eyes_Half_Open", 4:"Eyes_Open", frames:5, currentFrame:0};

  animationBlink = () => {
    
    console.log("Starting Animation");
    const eyes = this.querySelector("#ImgEyes");

    const animate = () => {
      console.log("Playing frame " + this.blinkAnimationOrder['currentFrame']);
      eyes.src = `assets/Images/Character/EyesImages/${this.blinkAnimationOrder[this.blinkAnimationOrder['currentFrame']++]}.png`
      setTimeout(() => this.blinkAnimationOrder['currentFrame'] < this.blinkAnimationOrder['frames'] ? (requestAnimationFrame(animate)) : this.blinkAnimationOrder['currentFrame'] = 0, 100);
    }
    requestAnimationFrame(animate);

    setTimeout(() => requestAnimationFrame(this.animationBlink), 5000);
  }

  speaking = false;
  speakAnimationFrame = 0;

  startSpeaking() {
    this.speaking = true;
    this.animationSpeak();
  }

  stopSpeaking() {
    this.speaking = false;
  }

  animationSpeak = () => {

    const face = this.querySelector("#ImgFace");

    const animate = () => {
      face.src = `assets/Images/Character/FaceImages/${this.expressionMap[this.currentExpression]}/${this.eyebrowId}_${this.expressionMap[this.currentExpression]}${this.speakAnimationFrame == 0 ? "" : "_Speaking"}.png`;
      this.speakAnimationFrame = (++this.speakAnimationFrame) % 2;
      if(this.speaking) setTimeout(() => requestAnimationFrame(animate), 100);
    }

    requestAnimationFrame(animate);

  }

  async characterJoins(novelName) {
    await this.generateIds(novelName);
    await this.addImages(novelName);
    this.animationBlink();
  }

  expressionMap = {
    0 : "Amazed",
    1 : "Critical",
    2 : "Defeated",
    3 : "Dissatisfied",
    4 : "Laughing",
    5 : "Neutral",
    6 : "Neutral_Relaxed",
    7 : "Proud",
    8 : "Questioning",
    9 : "Rejecting",
    10 : "Scared",
    11 : "Smiling",
    12 : "Smiling_Big"
  }

  currentExpression = 0

  updateCharacterExpression(expressionId) {
    this.currentExpression = expressionId;
    const face = this.querySelector('#ImgFace');
    face.src = `assets/Images/Character/FaceImages/${this.expressionMap[this.currentExpression]}/${this.eyebrowId}_${this.expressionMap[expressionId]}.png`
  }

  skinSpriteId = "";
  headSpriteId = 0;
  clothesSpriteId = 0;
  hairSpriteId = 0;
  eyebrowId;

  async generateIds(novelName) {
    console.log("generateIds")
    for(let i = 1; true; i++) {
      const response = await fetch(`assets/Images/Character/HairImages/${novelName}/${novelName}_Hair_${i}.png`, { method: 'HEAD' });
      if(!response.ok) {
        this.hairSpriteId = Math.ceil(Math.random() * (i-1));
        break;
      }
    }
    console.log(this.hairSpriteId);
    for(let i = 1; true; i++) {
      const response = await fetch(`assets/Images/Character/ClothesImages/${novelName}/${novelName}_Clothes_${i}.png`, { method: 'HEAD' });
      if(!response.ok) {
        this.clothesSpriteId = Math.ceil(Math.random() * (i-1));
        break;
      }
    }
    console.log(this.clothesSpriteId);
    this.skinSpriteId = skinSprites[Math.floor(Math.random() * skinSprites.length)];
    this.headSpriteId = Math.ceil(Math.random() * headSpriteCount);
    this.eyebrowId = Math.random() > 0.5 ? "Fine" : "Strong";

    
    
  }

  addImages(novelName) {
    console.log("addItems")
    let paths = []
    paths.push(['ImgHead', `assets/Images/Character/HeadImages/${novelName == 'Einstieg' ? "Einstieg_Head_1" : `Head_${this.headSpriteId}/Head_${this.headSpriteId}_${this.skinSpriteId}`}.png`]);
    paths.push(['ImgClothes', `assets/Images/Character/ClothesImages/${novelName}/${novelName}_Clothes_${this.clothesSpriteId}.png`]);
    paths.push(['ImgHair', `assets/Images/Character/HairImages/${novelName}/${novelName}_Hair_${this.hairSpriteId}.png`]);
    paths.push(['ImgFace', `assets/Images/Character/FaceImages/Neutral/Fine_Neutral.png`]);
    paths.push(['ImgEyes', `assets/Images/Character/EyesImages/Eyes_Open.png`]);

    for(let i = 0; i < paths.length; i++) {
      let img = document.createElement("img");
      img.id = paths[i][0];
      img.src = paths[i][1];
      img.className = "col-start-1 row-start-1 object-scale-down";
      this.appendChild(img);
    }
  }

}

customElements.define("character-box", CharacterBox);