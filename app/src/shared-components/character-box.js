import { fetchFromJson } from "../shared-services/fetch-service.js";

const skinSprites = ['a','b','c','d'];
const headSpriteCount = 2;
const baseImagePath = 'assets/Images/Character';
const expressionMap = {
    4 : "Amazed",
    6 : "Critical",
    1 : "Defeated",
    2 : "Dissatisfied",
    8 : "Laughing",
    11 : "Neutral",
    10 : "Neutral_Relaxed",
    12 : "Proud",
    5 : "Questioning",
    3 : "Rejecting",
    0 : "Scared",
    9 : "Smiling",
    7 : "Smiling_Big"
  }

class CharacterBox extends HTMLElement {
  
  characterInfo;
  novelName;
  eyebrowType; //The Type of character Eyebrows. Can be either "Fine" or "Strong"

  hairSpriteId = 0;
  clothesSpriteId = 0;
  headSpriteId = 0;
  skinSpriteId = "";

  connectedCallback() {
    this.classList.add("absolute", "w-[75cqw]", "grid", "grid-cols-1", "grid-rows-1", "z-30", "origin-[50%_20%]");
  }

  disconnectedCallback() {
    this.stopBlinking();
  }

  /**
   * 
   * @param {String} imageType
   * @param {} id
   * @param {boolean} speaking only for FaceImages
   * @returns the Full path of the requested resource
   */
  getImagePath(imageType, id, speaking) {
    console.log(`ImageRequest ${imageType} | ${this.hairSpriteId}`);
    switch (imageType) {
      case "Clothes":
        return `${baseImagePath}/ClothesImages/${this.novelName}/${this.characterInfo["name"] ? `${this.characterInfo["name"]}/${this.characterInfo["name"]}` : this.novelName}_Clothes_${this.clothesSpriteId}.png`;
      case "Headset":
        return `${baseImagePath}/ClothesImages/${this.novelName}/${this.characterInfo["name"] ? `${this.characterInfo["name"]}/${this.characterInfo["name"]}` : this.novelName}_Headset.png`;
      case "Eyes":
        return `${baseImagePath}/EyesImages/${id}.png`;
      case "Face":
        return `${baseImagePath}/FaceImages/${expressionMap[id]}/${this.eyebrowType}_${expressionMap[id]}${speaking ? "_Speaking" : ""}.png`;
      case "Glasses":
        return `${baseImagePath}/GlassesImages/Glasses.png`;
      case "Hair":
        return `${baseImagePath}/HairImages/${this.novelName}/${this.characterInfo["name"] ? `${this.characterInfo["name"]}/${this.characterInfo["name"]}` : this.novelName}_Hair_${this.hairSpriteId}.png`;
      case "Hands":
        return `${baseImagePath}/HandsImages/${this.novelName}/${this.characterInfo["name"] ? `${this.characterInfo["name"]}/${this.characterInfo["name"]}` : this.novelName}_Hands_${this.skinSpriteId}.png`;
      case "Head":
        return `${baseImagePath}/HeadImages/${this.novelName === "Einstieg" ? "Einstieg_Head_1" : `Head_${this.headSpriteId}/Head_${this.headSpriteId}_${this.skinSpriteId}`}.png`;
    }
  }

  async characterJoins(novelName, characterId) {
    await this.loadCharacterInfo(characterId);
    this.novelName = novelName;

    this.setCharacterPosition();
    await this.generateIds();

    await this.addImages();
    this.startBlinking();
  }

  async loadCharacterInfo(characterId) {
    let data = await fetchFromJson("assets/json/character-info.json");
    this.characterInfo = data["characters"].filter(c => c.id == characterId)[0];
  }

  setCharacterPosition() {
    this.style.left = `${this.characterInfo["positionX"]}cqw`;
    this.style.top = `${this.characterInfo["positionY"]}cqw`;
    this.style.rotate = "0deg";
  }
  
  async generateIds() {
    console.log("generateIds");
    // HairSpriteId
    for(let i = 1; true; i++) {
      this.hairSpriteId = i;
      const response = await fetch(this.getImagePath("Hair"), {method : 'HEAD'});
      if(!response.ok) {
        this.hairSpriteId = Math.ceil(Math.random() * (i-1));
        break;
      }
    }

    // ClothesSpriteId
    for(let i = 1; true; i++) {
      this.clothesSpriteId = i;
      const response = await fetch(this.getImagePath("Clothes"), { method: 'HEAD' });
      if(!response.ok) {
        this.clothesSpriteId = Math.ceil(Math.random() * (i-1));
        break;
      }
    }


    this.skinSpriteId = skinSprites[Math.floor(Math.random() * skinSprites.length)];
    this.headSpriteId = Math.ceil(Math.random() * headSpriteCount);
    this.eyebrowType = Math.random() > 0.5 ? "Fine" : "Strong";
  }

  async addImages(novelName) {
    console.log("addImages");
    let paths = []
    paths.push(['ImgHead', this.getImagePath("Head")]);
    paths.push(['ImgHair', this.getImagePath("Hair")]);
    paths.push(['ImgClothes', this.getImagePath("Clothes")]);
    paths.push(['ImgFace', this.getImagePath("Face", 5, false)]);
    paths.push(['ImgEyes', this.getImagePath("Eyes", "Eyes_Open")]);
    if(this.characterInfo["glasses"]) paths.push(['ImgGlasses', this.getImagePath("Glasses")]);
    if(this.characterInfo["headset"]) paths.push(['ImgHeadset', this.getImagePath("Headset")]);

    //Hands
    const handsResponse = await fetch(this.getImagePath('Hands'), { method: 'HEAD'})
    if(handsResponse.ok) {
      paths.push(['ImgHands', this.getImagePath("Hands")]);
    }

    for(let i = 0; i < paths.length; i++) {
      let img = document.createElement("img");
      img.id = paths[i][0];
      img.src = paths[i][1];
      img.className = "h-full w-full col-start-1 row-start-1 object-contain";
      this.appendChild(img);
    }
  }
  
  currentExpression = 0

  updateCharacterExpression(expressionId) {
    this.currentExpression = expressionId;
    const face = this.querySelector('#ImgFace');
    face.src = this.getImagePath("Face", this.currentExpression, false);

    // Play animations based on new Expression
    switch(expressionId) {
      case 0: this.animationScared(); break;
      case 4: this.animationAmazed(); break;
      case 5: this.animationQuestioning(); break;
    }
  }
  
  /////
  // Blinking mechanics
  /////

  blinking = false;
  startBlinking() {
    this.blinking = true;
    this.animationBlink();
  }

  stopBlinking() {
    this.blinking = false;
  }
  
  blinkAnimationOrder = {0:"Eyes_Open", 1:"Eyes_Half_Open", 2:"Eyes_Closed", 3:"Eyes_Half_Open", 4:"Eyes_Open", frames:5, currentFrame:0};
  animationBlink = () => {
    console.log("Starting Animation Blink");
    const eyes = this.querySelector("#ImgEyes");

    const animate = () => {
      eyes.src = `assets/Images/Character/EyesImages/${this.blinkAnimationOrder[this.blinkAnimationOrder['currentFrame']++]}.png`
      setTimeout(() => this.blinkAnimationOrder['currentFrame'] < this.blinkAnimationOrder['frames'] ? (requestAnimationFrame(animate)) : this.blinkAnimationOrder['currentFrame'] = 0, 100);
    }
    requestAnimationFrame(animate);

    if(this.blinking) setTimeout(() => requestAnimationFrame(this.animationBlink), Math.random() * 5000 + 500);
  }

  /////
  // Speaking mechanics
  /////

  speaking = false;
  speakAnimationFrame = 0;
  speakingId;

  startSpeaking() {
    if(this.speaking == true) throw "Already speaking"
    this.speaking = true;
    this.speakingId = crypto.randomUUID();
    this.animationSpeak();
  }

  stopSpeaking() {
    this.speaking = false;
  }

  animationSpeak = () => {
    console.log("Starting animation Speak");
    const face = this.querySelector("#ImgFace");
    const id = this.speakingId;

    const animate = () => {
      if(this.speaking && this.speakingId == id) {
        face.src = this.getImagePath("Face", this.currentExpression, this.speakAnimationFrame ? true : false);
        this.speakAnimationFrame = (++this.speakAnimationFrame) % 2;
        setTimeout(() => requestAnimationFrame(animate), 300);
      } else {
        face.src = this.getImagePath("Face", this.currentExpression, false);
      }
    }

    requestAnimationFrame(animate);
  }



  /////
  //  Animation : Scared
  /////

  animationScared = () => {
    console.log("Starting animation Scared");
    const maxRad = 10;
    const duration = 100;
    const speedFactor = 0.2;
    const radDecreaseFactor = 1.03
    let frame = 0;

    const animate = () => {
      this.style.left = `${this.characterInfo["positionX"] - maxRad * Math.cos(speedFactor * frame)/Math.pow(radDecreaseFactor, frame)}cqw`;
      this.style.top = `${this.characterInfo["positionY"] + maxRad * Math.sin(speedFactor * frame)/Math.pow(radDecreaseFactor, frame)}cqw`;
      console.log(`Animation scared: frame ${frame} | left: ${this.style.left} | top : ${this.style.top}`);
      
      
      if((++frame) <= duration) {requestAnimationFrame(animate)}
      else {
        this.setCharacterPosition();
      }
    }
    requestAnimationFrame(animate);
  }

  /////
  //  Animation : Amazed
  /////

  animationAmazed = () => {
    console.log("Starting animation Amazed");
    const maxUp = 20;
    const speedFactor = 1.7;
    let frame = 0;

    const animate = () => {
      console.log("Amazed animation frame " + frame);
      this.style.top = `${this.characterInfo["positionY"] - maxUp + Math.abs(maxUp - frame*speedFactor)}cqw`;
      
      
      if((++frame) <= 2*maxUp/speedFactor) {requestAnimationFrame(animate)}
      else {
        this.setCharacterPosition();
      }
    }
    requestAnimationFrame(animate);
  }

  /////
  //  Animation : Questioning
  /////

  animationQuestioning = () => {
    console.log("Starting animation Questioning");
    const maxRotate = 5;
    const speedFactor = 0.15;
    let frame = 0;

    const animate = () => {
      console.log("Questioning animation frame " + frame);
      this.style.rotate = `${maxRotate - Math.abs(maxRotate - frame*speedFactor)}deg`;
      
      
      if((++frame) <= 2*maxRotate/speedFactor) {requestAnimationFrame(animate)}
      else {
        this.setCharacterPosition();
      }
    }
    requestAnimationFrame(animate);
  }
}

customElements.define("character-box", CharacterBox);