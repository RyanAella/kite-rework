import '../headers/navigation-header.js';
import '../footer.js'

const viewportSize = 1000;

const hexXDiff = 380;
const hexYEven = -298;
const hexYOdd = -112;
const infoHexPos = {"x":347,"y":800};

const bg2Scrolling = 48;
const bg1Scrolling = 10;

const bg2ScrollingFactor = 0.0005;
const bg1ScrollingFactor = 0.001;
const hexScrollingFactor = 0.09;

const velocityDragFactor = 5;

// This Variable does not influence the size of Hexagons, but is a representation of a Hexagons size for scrolling calculations
const hexSizeX = 306;

class NovelSelector extends HTMLElement {
    
    bg_pos = 0;
    isDown = false;
    startX; scrollLeft;
    scrollingVelocity = 0;

    async connectedCallback() {
        await this.loadNovels();
        this.renderHTML();
        this.addEventListeners();
        this.moveElements();
    }
    
    async loadNovels() {
        let response = await fetch("assets/json/novels.json");
        let data = await response.json();
        const allNovels = data['visualNovels'];
        this.einstiegNovel = allNovels.find(novel => novel.name === "Einstieg");
        this.novels = allNovels.filter(novel => novel.name !== "Einstieg");
    }

    renderHTML() {
        let counter = 0;
        const novelItemsHtml = this.novels.map(novel => {
            return `${this.createHex(counter*hexXDiff, counter++%2==0 ? hexYEven : hexYOdd, novel)}`;
        }).join('');

        const infoHex = this.createHex(infoHexPos.x, infoHexPos.y, this.einstiegNovel, true);

        // base structure
        this.innerHTML = 
        `
        <div class="flex flex-col">
            <navigation-header></navigation-header>
            <div id=bg-2 class="w-full h-[160cqw] bg-panorama-landschaft overflow-hidden bg-[length:auto_100%] bg-repeat-x">
                <div id=bg-1 class="w-full h-full bg-panorama relative overflow-hidden bg-[length:auto_100%] bg-repeat-x">
                    <div id="novel-hexes" class="absolute inset-0 w-full h-full">
                        ${novelItemsHtml}
                    </div>
                    
                    <div id="bubble" class="absolute left-[8cqw] top-[67.1cqw] w-[84cqw] pointer-events-auto z-50">
                    </div>

                    ${infoHex}
                </div>
            </div>
            <main-footer active-scene="novel-selector"><main-footer>
        </div>`;

        let hexes = this.querySelector('#novel-hexes').children;
        this.firstHexPos = 0;
        this.lastHexPos = (this.novels.length - 1) * hexXDiff;
    }

    moveElements = () => {
        //console.log(this.bg_pos);
        document.getElementById('bg-1').style = `background-position: ${bg1Scrolling + this.bg_pos * bg1ScrollingFactor}% 0%;`;
        document.getElementById('bg-2').style = `background-position: ${bg2Scrolling + this.bg_pos * bg2ScrollingFactor}% 0%;`;

        let novelHexes = this.querySelector('#novel-hexes');
        novelHexes.style.transform = `translateX(${this.bg_pos * -hexScrollingFactor / 10}cqw)`;

        const scaledFirstHexPos = (this.firstHexPos - (viewportSize-hexSizeX)/2) / hexScrollingFactor;
        const scaledLastHexPos = (this.lastHexPos - (viewportSize-hexSizeX)/2) / hexScrollingFactor;

        if(this.bg_pos < scaledFirstHexPos) {
            this.scrollingVelocity = 30 + Math.abs(scaledFirstHexPos - this.bg_pos)/30;
        } else if(this.bg_pos > scaledLastHexPos) {
            this.scrollingVelocity = -(30 + Math.abs(scaledLastHexPos - this.bg_pos)/30);
        }

        if(this.scrollingVelocity != 0 && !this.isDown) {
            console.log("Scrolling with velocity " + this.scrollingVelocity);
            this.bg_pos += this.scrollingVelocity
            const velocityDrag = velocityDragFactor + Math.abs(this.scrollingVelocity/30)
            if(this.scrollingVelocity > 0) {
                this.scrollingVelocity = this.scrollingVelocity >= velocityDrag ? this.scrollingVelocity - velocityDrag : 0
            } else {
                this.scrollingVelocity = this.scrollingVelocity <= -velocityDrag ? this.scrollingVelocity + velocityDrag : 0
            }
            requestAnimationFrame(this.moveElements);
        }

    }

    bubbleAnimation = (destination) => {

        let frame = 0;
        let animationLength = 20;
        let velocity = (destination - this.bg_pos)/animationLength;

        const animate = () => {
            this.bg_pos += velocity;
            this.moveElements();

            if (++frame < animationLength) {
                requestAnimationFrame(animate);
            } else {
                this.bg_pos = destination;
            }
        }
        requestAnimationFrame(animate);
    }
    
    getNovel = (novelName) => {
        if (novelName === "Einstieg") return this.einstiegNovel;
        return this.novels.find(novel => novel.name === novelName);
    }
    
    createHex = (posX, posY, novel, isInfo = false) => {
        const left = posX / 10;
        const top = (posY / 10) + 50;
        const w = 29.6; // 296/10
        const h = 26.6; // 266/10

        return `
            <div ${isInfo ? 'id="InfoHex"' : `data-id="${novel.name}"`}
                class="absolute flex items-center justify-center"
                style="left: ${left}cqw; top: ${top}cqw; width: ${w}cqw; height: ${h}cqw;"
            >
                <svg viewBox="0 0 296 266" class="absolute inset-0 w-full h-full z-0 overflow-visible">
                    <path
                        d="M 96.5,0 L 209.5,0 Q 229.5,0 239.5,17.3 L 296,115.7 Q 306,133 296,150.3 L 239.5,248.7 Q 229.5,266 209.5,266 L 96.5,266 Q 76.5,266 66.5,248.7 L 10,150.3 Q 0,133 10,115.7 L 66.5,17.3 Q 76.5,0 96.5,0 Z" 
                        fill="${novel.novelColor}" 
                        stroke="${novel.novelFrameColor}"
                        stroke-width="12"
                        class="transition-colors duration-300"
                    />
                </svg>
                
                <div class="relative z-10 w-[80%] text-center text-white text-[3.6cqw] font-semibold pointer-events-none">
                    ${novel.title}
                </div>
            </div>
        `;
    }

    removeBubble = () => {
        const bubble = document.getElementById('bubble');
        bubble.replaceChildren();
    }

    createBubble = (novel) => {
        const bubble = document.getElementById('bubble');
        bubble.innerHTML = `
            <div class="relative flex flex-col items-center max-w-lg font-sans">
                
                <!-- Die Sprechblasen-Spitze (SVG) -->
                <div class="w-0 h-0 border-l-[2cqw] border-l-transparent border-r-[2cqw] border-r-transparent border-b-[6cqw]"
                    style = "border-bottom-color: ${novel.novelColor}" 
                ></div>

                <!-- Hauptbox -->
                <div id="bubble-box"
                    class="text-white p-[5cqw] rounded-[1.6cqw] w-full"
                    style = "background-color: ${novel.novelColor}"
                >
                    <!-- Text-Inhalt -->
                    <p class="text-[3cqw] p-[3.2cqw] font-semibold leading-normal mb-[3.2cqw] text-center">
                        ${novel.description}
                    </p>

                    <!-- Button-Leiste -->
                    <div class="flex gap-[2.5cqw] justify-center mb-[2cqw]">
                        
                        <div id="play-button" class="button-play bg-contain bg-no-repeat object-contain h-[6cqw] w-[24cqw] font-bold text-[2.4cqw] pl-[6.4cqw] flex items-center"
                            style="color:${novel.novelColor}"
                        >
                            SPIELEN
                        </div>

                        <div id="remember-button" class="button-remember bg-contain bg-no-repeat object-contain h-[6cqw] w-[24cqw] font-bold text-[2.4cqw] pl-[6.4cqw] flex items-center"
                            style="color:${novel.novelColor}"
                        >
                            MERKEN
                        </div>
                    </div>
                </div>
            </div>
        `;
        const bubbleBox = this.querySelector('#bubble-box');

        bubbleBox.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        bubbleBox.addEventListener('mousedown', (event) => {
            event.stopPropagation();
        });

        this.querySelector('#play-button').addEventListener('click', (event) => {
            // just for log info (for now)
            const novelId = novel.name;
            console.log(`Novel clicked: ${novelId}`);
                
            // switching to a scene
            this.dispatchEvent(new CustomEvent("sm-switch-scene", {
                detail: { 
                    scene: "novel-scene",
                    args: {
                        novel: novel
                    }
                },
                bubbles: true,
                composed: true
            }));
        });

        this.querySelector('#remember-button').addEventListener('click', () => {
            //TODO: Adding funktionality for Novel Rememberence
            console.log("Adding Novel to Remembered");
        });
    }

    addEventListeners() {

        const dragStart = (event) => {
            this.isDown = true;
            this.startX = event.pageX ?? event.changedTouches[0].screenX;
        }

        const dragEnd = () => {
            this.isDown = false;
            this.moveElements();
        }

        const drag = (event) => {
            if (!this.isDown) return;
            const x = event.pageX ?? event.changedTouches[0].screenX;
            const walk = (x - this.startX);
            this.startX = x;
            this.bg_pos -= (walk*24.3);
            this.scrollingVelocity = -(walk*24.3);
            console.log("Dragging with velocity " + this.scrollingVelocity);
            this.moveElements();
        }

        this.addEventListener("wheel", (e) => {
            console.log("Wheel Event " + e.deltaY);
            this.bg_pos -= (e.deltaY + e.deltaX);
            this.scrollingVelocity = -(e.deltaY + e.deltaX);
            this.moveElements()
        });

        this.addEventListener('mousedown', (event) => dragStart(event));
        this.addEventListener('touchstart', (event) => dragStart(event))
        this.addEventListener('mouseleave', () => dragEnd());
        this.addEventListener('mouseup', () => dragEnd());
        this.addEventListener('touchend', () => dragEnd());
        this.addEventListener('touchcancel', () => dragEnd());
        this.addEventListener('mousemove', (event) => drag(event));
        this.addEventListener('touchmove', (event) => drag(event));

        this.addEventListener('click', (event) => {
            if(event["activeHex"] === undefined) {
                this.removeBubble();
            }
            Array.from(this.querySelector("#novel-hexes").children).forEach(hex => {
                let path = hex.querySelector("path");
                let novel = this.getNovel(hex.getAttribute('data-id'));
                if(event["activeHex"] == hex) {
                    path.setAttribute("stroke", novel.novelColor);
                    this.createBubble(novel);
                    const hexId = hex.getAttribute('data-id');
                    const novelIndex = this.novels.findIndex(n => n.name === hexId);
                    const logicalPosX = novelIndex * hexXDiff;
                    this.bubbleAnimation((logicalPosX - (viewportSize-hexSizeX)/2) / hexScrollingFactor);
                } else {
                    path.setAttribute("stroke", novel.novelFrameColor);
                } 
            });
        });

        Array.from(this.querySelector("#novel-hexes").children).forEach(hex => {
            console.log("Adding listener to hex");
            hex.addEventListener("click", (event) => {
                console.log("Clicked on Hex");
                event["activeHex"] = hex;
            })
        });

        this.querySelector('#InfoHex').addEventListener('click', () => {
            console.log("Switching to Info Screen");
        });
    }
}

customElements.define('novel-selector', NovelSelector);
