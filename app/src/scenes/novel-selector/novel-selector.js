import '../../shared-components/headers/navigation-header.js';
import '../../shared-components/footer.js';
import { createHex } from './hex-component.js';
import { moveElements } from './move-elements-service.js';
import { createBubble, removeBubble, refreshHexBookmarkMarker, bubbleAnimation } from "./bubble-component.js";
import { bookmarkedNovelStore } from '../../shared-services/store-service.js';
import { getArchiveData } from "../../shared-services/archive-data-service.js";
import { playNumberBlinkSequence } from "./bubble-animation-service.js";

const viewportSize = 1000;

const hexXDiff = 380;
const hexYEven = -258;
const hexYOdd = -72;
const infoHexPos = {"x":347,"y":720};

const hexScrollingFactor = 0.09;

// This Variable does not influence the size of Hexagons, but is a representation of a Hexagons size for scrolling calculations
const hexSizeX = 306;

class NovelSelector extends HTMLElement {
    
    bgPos = 0;
    isDown = false;
    startX; scrollLeft;
    scrollingVelocity = 0;

    bookmarkedNovels = new Set();

    isBookmarked = (novelName) => this.bookmarkedNovels.has(novelName);
    
    archiveData = getArchiveData();

    toggleBookmarked = (novelName) => {
        bookmarkedNovelStore.toggle(this.bookmarkedNovels, novelName);
    }

    async connectedCallback() {
        await this.loadNovels();
        this.bookmarkedNovels = bookmarkedNovelStore.load(this.novels.map((n) => n.name));
        this.renderHTML();
        this.addEventListeners();
        this.boundMovedElements = moveElements.bind(this, hexScrollingFactor, viewportSize, hexSizeX);
        this.boundMovedElements();
        if (this.args && this.args.fromCompletion) {
            console.log(this.args);
            playNumberBlinkSequence();
        }
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
            return `${createHex(counter*hexXDiff, counter++%2==0 ? hexYEven : hexYOdd, novel, false, this.isBookmarked, this.archiveData, this.args)}`;
        }).join('');

        const infoHex = createHex(infoHexPos.x, infoHexPos.y, this.einstiegNovel, true, this.isBookmarked, this.archiveData, this.args);

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
    
    getNovel = (novelName) => {
        if (novelName === "Einstieg") return this.einstiegNovel;
        return this.novels.find(novel => novel.name === novelName);
    }

    addEventListeners() {

        const dragStart = (event) => {
            this.isDown = true;
            this.startX = event.pageX ?? event.changedTouches[0].screenX;
        }

        const dragEnd = () => {
            this.isDown = false;
            this.boundMovedElements();
        }

        const drag = (event) => {
            if (!this.isDown) return;
            const x = event.pageX ?? event.changedTouches[0].screenX;
            const walk = (x - this.startX);
            this.startX = x;
            this.bgPos -= (walk*24.3);
            this.scrollingVelocity = -(walk*24.3);
            console.log("Dragging with velocity " + this.scrollingVelocity);
            this.boundMovedElements();
        }

        this.addEventListener("wheel", (e) => {
            console.log("Wheel Event " + e.deltaY);
            this.bgPos -= (e.deltaY + e.deltaX);
            this.scrollingVelocity = -(e.deltaY + e.deltaX);
            this.boundMovedElements();
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
                removeBubble();
            }
            Array.from(this.querySelector("#novel-hexes").children).forEach(hex => {
                let path = hex.querySelector("path");
                let novel = this.getNovel(hex.getAttribute('data-id'));
                console.log(novel);
                if(event["activeHex"] == hex) {
                    path.setAttribute("stroke", novel.novelColor);
                    createBubble.call(this, novel);
                    const hexId = hex.getAttribute('data-id');
                    const novelIndex = this.novels.findIndex(n => n.name === hexId);
                    const logicalPosX = novelIndex * hexXDiff;
                    bubbleAnimation.call(this, (logicalPosX - (viewportSize-hexSizeX)/2) / hexScrollingFactor);
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

        this.querySelector('#InfoHex').addEventListener('click', (e) => {
            console.log("Switching to Info Screen");
            e.stopPropagation(); 
            this.dispatchEvent(new CustomEvent("sm-switch-scene", {
                detail: { scene: "about-kite-scene" },
                bubbles: true,   
                composed: true, 
            }));
        });
    }
}

customElements.define('novel-selector', NovelSelector);
