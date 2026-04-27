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

const hexSizeX = 306;

class NovelSelector extends HTMLElement {
    
    bg_pos = 0;
    isDown = false;
    startX;
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

        this.innerHTML = 
        `<navigation-header></navigation-header>

        <div id="scene" class="relative w-full h-full overflow-hidden touch-pan-y">

            <div id="bg-2" class="w-full h-full bg-panorama-landschaft absolute inset-0">
                <div id="bg-1" class="w-full h-full bg-panorama absolute inset-0">

                    <svg viewBox="0 0 ${viewportSize} ${viewportSize}" class="w-full h-full">
                        <g id="novel-hexes">
                            ${novelItemsHtml}
                        </g>
                        ${infoHex}
                    </svg>

                </div>
            </div>

            <!-- ✅ FIXED BUBBLE -->
            <div id="bubble" 
                class="absolute left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md top-[170px] md:top-[260px]">
            </div>

        </div>

        <main-footer active-scene="novel-selector"></main-footer>`;

        let hexes = this.querySelector('#novel-hexes').children;
        this.firstHexPos = 0;
        this.lastHexPos = (hexes.length - 1) * hexXDiff;
    }

    moveElements = () => {
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
        return `<g ${isInfo ? 'id="InfoHex"' : `data-id=${novel.name} data-pos-x=${posX}`}
                transform = translate(${posX},${posY})
            >
            <path
                d="M 96.5,0 L 209.5,0 Q 229.5,0 239.5,17.3 L 296,115.7 Q 306,133 296,150.3 L 239.5,248.7 Q 229.5,266 209.5,266 L 96.5,266 Q 76.5,266 66.5,248.7 L 10,150.3 Q 0,133 10,115.7 L 66.5,17.3 Q 76.5,0 96.5,0 Z" 
                fill=${novel.novelColor} 
                stroke=${novel.novelFrameColor}
                stroke-width="12"
            />
            <foreignObject x="30" y="75" width="246" height="106">
                <p class="text-white text-4xl text-center font-semibold">
                    ${novel.title}
                </p>
            </foreignObject>
            </g>`;
    }

    removeBubble = () => {
        const bubble = this.querySelector('#bubble');
        bubble.replaceChildren();
    }

    createBubble = (novel) => {
        const bubble = this.querySelector('#bubble');

        bubble.innerHTML = `
            <div class="flex flex-col items-center w-full font-sans">
                
                <!-- Pfeil -->
                <div class="w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-b-60"
                    style="border-bottom-color: ${novel.novelColor}"></div>

                <!-- Box -->
                <div class="text-white p-6 rounded-2xl w-full box-border"
                    style="background-color: ${novel.novelColor}">
                    
                    <p class="text-2xl md:text-3xl font-semibold mb-6">
                        ${novel.description}
                    </p>

                    <div class="flex flex-col md:flex-row gap-4 justify-center items-center">

                        <div id="play-button" 
                            class="button-play bg-contain bg-no-repeat h-15 w-full max-w-[220px] text-xl pl-12 flex items-center justify-center cursor-pointer"
                            style="color:${novel.novelColor}">
                            SPIELEN
                        </div>

                        <div id="remember-button" 
                            class="button-remember bg-contain bg-no-repeat h-15 w-full max-w-[220px] text-xl pl-12 flex items-center justify-center cursor-pointer"
                            style="color:${novel.novelColor}">
                            MERKEN
                        </div>

                    </div>
                </div>
            </div>
        `;

        this.querySelector('#play-button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent("sm-switch-scene", {
                detail: { scene: "novel-scene", args: { novel } },
                bubbles: true,
                composed: true
            }));
        });
    }

    addEventListeners() {

        const getPointerX = (event) => {
            if(event.touches && event.touches[0]) return event.touches[0].clientX;
            return event.clientX;
        }

        const dragStart = (event) => {
            this.isDown = true;
            this.startX = getPointerX(event);
        }

        const dragEnd = () => {
            this.isDown = false;
            this.moveElements();
        }

        const drag = (event) => {
            if (!this.isDown) return;
            const x = getPointerX(event);
            const walk = (x - this.startX);
            this.startX = x;
            this.bg_pos -= (walk*24.3);
            this.scrollingVelocity = -(walk*24.3);
            this.moveElements();
        }

        this.addEventListener('mousedown', dragStart);
        this.addEventListener('mouseup', dragEnd);
        this.addEventListener('mousemove', drag);

        this.addEventListener('click', (event) => {
            if(event["activeHex"] === undefined) {
                this.removeBubble();
            }

            Array.from(this.querySelector("#novel-hexes").children).forEach(hex => {
                let novel = this.getNovel(hex.getAttribute('data-id'));

                if(event["activeHex"] == hex) {
                    this.createBubble(novel);
                    const hexLocalX = Number(hex.getAttribute('data-pos-x')) || 0;
                    this.bubbleAnimation((hexLocalX - (viewportSize-hexSizeX)/2) / hexScrollingFactor);
                }
            });
        });

        Array.from(this.querySelector("#novel-hexes").children).forEach(hex => {
            hex.addEventListener("click", (event) => {
                event["activeHex"] = hex;
            })
        });
    }
}

customElements.define('novel-selector', NovelSelector);