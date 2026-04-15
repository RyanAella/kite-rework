import '../headers/navigation-header.js';

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
        let response = await fetch("assets/novels.json");
        let data = await response.json();
        this.novels = data['visualNovels'];
    }

    renderHTML() {
        let counter = 0;
        const novelItemsHtml = this.novels.map(novel => {
            return `${this.createHex(counter*hexXDiff, counter++%2==0 ? hexYEven : hexYOdd, novel)}`;
        }).join('');

        const infoHex = this.createHex(infoHexPos.x, infoHexPos.y, this.getNovel("Einstieg"), true);

        // base structure
        this.innerHTML = 
        `<navigation-header></navigation-header>
        <div id=bg-2 class="w-full h-full bg-panorama-landschaft">
            <div id=bg-1 class="w-full h-full bg-panorama">
                <svg viewBox="0 0 ${viewportSize} ${viewportSize}" class="w-full h-full">
                    <g id=novel-hexes>
                    ${novelItemsHtml}
                    </g>
                    <foreignObject
                        id = "bubble"
                        x = "80" 
                        y = "171"
                        width = "840"
                        height = "800"
                    >
                    </foreignObject>
                    ${infoHex}
                </svg>
            </div>
        </div>`;

        let hexes = this.querySelector('#novel-hexes').children;
        this.firstHexPos = new DOMMatrix(window.getComputedStyle(hexes[0]).transform).m41;
        this.lastHexPos = new DOMMatrix(window.getComputedStyle(hexes[hexes.length - 1]).transform).m41;
    }

    moveElements = () => {
        //console.log(this.bg_pos);
        document.getElementById('bg-1').style = `background-position: ${bg1Scrolling + this.bg_pos * bg1ScrollingFactor}% 0%;`;
        document.getElementById('bg-2').style = `background-position: ${bg2Scrolling + this.bg_pos * bg2ScrollingFactor}% 0%;`;

        let novelHexes = this.querySelector('#novel-hexes');
        novelHexes.setAttribute("transform", `translate(${this.bg_pos*-hexScrollingFactor},0)`);

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
        return this.novels.find(novel => novel.name === novelName);
    }
    
    createHex = (posX, posY, novel, isInfo = false) => {
        return `<g ${isInfo ? 'id="InfoHex"' : `data-id=${novel.name}`}
                transform = translate(${posX},${posY})
            >
            <path
                d="
                    M 96.5,0 
                    L 209.5,0 
                    Q 229.5,0 239.5,17.3
                    L 296,115.7
                    Q 306,133 296,150.3
                    L 239.5,248.7
                    Q 229.5,266 209.5,266
                    L 96.5,266
                    Q 76.5,266 66.5,248.7
                    L 10,150.3
                    Q 0,133 10,115.7
                    L 66.5,17.3
                    Q 76.5,0 96.5,0
                Z" 
                fill=${novel.novelColor} 
                stroke=${novel.novelFrameColor}
                stroke-width="12"
            />
            <foreignObject 
                x = "30" 
                y = "75"
                width = "246"
                height = "106"
                class = "flex items-center">
                <p class="flex items-center justify-center w-full h-full text-center text-white text-4xl leading-12 font-semibold select-none">
                    ${novel.title}
                </p>
            </foreignObject>
            </g>`
        ;
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
                <div class="w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-b-60"
                    style = "border-bottom-color: ${novel.novelColor}" 
                ></div>

                <!-- Hauptbox -->
                <div id="bubble-box"
                    class="text-white p-8 rounded-2xl w-full"
                    style = "background-color: ${novel.novelColor}"
                >
                    <!-- Text-Inhalt -->
                    <p class="text-3xl font-semibold leading-normal mb-8 select-none">
                        ${novel.description}
                    </p>

                    <!-- Button-Leiste -->
                    <div class="flex gap-4 justify-center mb-15">
                        
                        <div id="play-button" class="button-play bg-contain bg-no-repeat object-contain h-15 w-60 font-bold text-2xl pl-16 flex items-center select-none"
                            style="color:${novel.novelColor}"
                        >
                            SPIELEN
                        </div>

                        <div id="remember-button" class="button-remember bg-contain bg-no-repeat object-contain h-15 w-60 font-bold text-2xl pl-16 flex items-center select-none"
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
                    const matrix = new DOMMatrix(window.getComputedStyle(hex).transform);
                    const hexPosition = matrix.m41;
                    this.bubbleAnimation((hexPosition - (viewportSize-hexSizeX)/2) / hexScrollingFactor);
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
