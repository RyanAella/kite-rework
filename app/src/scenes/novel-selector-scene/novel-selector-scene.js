import '../../shared-components/headers/navigation-header-component.js';
import '../../shared-components/footer-component.js';
import { createHex } from './hex-component.js';
import { moveElements } from './move-elements-service.js';
import { createBubble, removeBubble, refreshHexBookmarkMarker, bubbleAnimation } from "./bubble-component.js";
import { bookmarkedNovelStore } from '../../shared-services/store-service.js';
import { markNovelSessionEnded } from '../../shared-services/novel-session-service.js';
import { getArchiveData } from "../../shared-services/archive-data-service.js";
import { playNumberBlinkSequence } from "./bubble-animation-service.js";
import { playIntroAnimation } from "./intro-animation-service.js";
import { fetchFromJson } from '../../shared-services/fetch-service.js';

const viewportSize = 1000;

const hexXDiff = 380;
const hexYEven = -288;
const hexYOdd = -102;
const infoHexPos = {"x":347,"y":740};

const hexScrollingFactor = 0.09;

const hexSizeX = 306; // This Variable does not influence the size of Hexagons, but is a representation of a Hexagons size for scrolling calculations

class NovelSelectorScene extends HTMLElement {
  
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
    // Safety net: reaching the hub means no novel is actively playing.
    markNovelSessionEnded();

    await this.loadNovels();
    this.bookmarkedNovels = bookmarkedNovelStore.load(this.novels.map((n) => n.name));
    this.renderHTML();
    this.addEventListeners();
    this.boundMovedElements = moveElements.bind(this, hexScrollingFactor, viewportSize, hexSizeX);
    this.boundMovedElements();
    if (this.args && this.args.fromCompletion) {
      playNumberBlinkSequence();
    }

    // Status-Flag, um die Animation bei Nutzerinteraktion abzubrechen
    this.isAnimatingIntro = true; 

    this.sceneManager = document.querySelector("scene-manager");
    this.boundPlayAnimation = playIntroAnimation.bind(this, hexScrollingFactor, viewportSize, hexSizeX);
    if (this.sceneManager.enterFirstTime) {
      setTimeout(() => this.boundPlayAnimation(), 1000);
    }
  }
  
  /**
   * Loads in the details about all novels.
   */
  async loadNovels() {
    let data = await fetchFromJson("assets/json/novels.json");
    const allNovels = data['visualNovels'];
    this.introNovel = allNovels.find(novel => novel.name === "Einstieg");
    this.novels = allNovels.filter(novel => novel.name !== "Einstieg");
  }

  /**
   * Adds the DOM contents of this Element.
   */
  renderHTML() {
    let counter = 0;
    const novelItemsHtml = this.novels.map(novel => {
      return `${createHex(counter*hexXDiff, counter++%2==0 ? hexYEven : hexYOdd, novel, false, this.isBookmarked, this.archiveData, this.args)}`;
    }).join('');

    const infoHex = createHex(infoHexPos.x, infoHexPos.y, this.introNovel, true, this.isBookmarked, this.archiveData, this.args);

    // base structure
    this.innerHTML = 
    `
    <div class="flex flex-col">
      <navigation-header></navigation-header>
      <div id=bg-2 class="w-full h-[160cqw] bg-panorama-landschaft overflow-hidden bg-[length:auto_100%] bg-repeat-x">
        <div id=bg-1 class="w-full h-full bg-panorama relative overflow-hidden bg-[length:auto_110%] bg-repeat-x">
          <div id="novel-hexes" class="absolute inset-0 w-full h-full">
            ${novelItemsHtml}
          </div>
          
          <div id="bubble" class="absolute left-[8cqw] top-[67.1cqw] w-[84cqw] pointer-events-auto z-50">
          </div>

          ${infoHex}
        </div>
      </div>
      <main-footer active-scene="novel-selector-scene"><main-footer>
    </div>`;

    let hexes = this.querySelector('#novel-hexes').children;
    this.firstHexPos = 0;
    this.lastHexPos = (this.novels.length - 1) * hexXDiff;
  }
  
  getNovel = (novelName) => {
    if (novelName === "Einstieg") return this.introNovel;
    return this.novels.find(novel => novel.name === novelName);
  }

  /**
   * Adds all Listeners for components of the novel selector.
   */
  addEventListeners() {

    const dragStart = (event) => {
      this.isAnimatingIntro = false;
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
      this.boundMovedElements();
    }

    this.addEventListener("wheel", (e) => {
      this.isAnimatingIntro = false;
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
      hex.addEventListener("click", (event) => {
        event["activeHex"] = hex;
      })
    });

    this.querySelector('#InfoHex').addEventListener('click', (e) => {
      e.stopPropagation(); 
      this.dispatchEvent(new CustomEvent("sm-switch-scene", {
        detail: { scene: "about-kite-scene" },
        bubbles: true
      }));
    });
  }
}

customElements.define('novel-selector-scene', NovelSelectorScene);
