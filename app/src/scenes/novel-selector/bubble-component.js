export function createBubble(novel) {
    const bubble = document.getElementById('bubble');

    // Bookmark button block
    let bookmarkButtonBlock;
    if (this.isBookmarked(novel.name)) {
        bookmarkButtonBlock = `
            <div id="bookmark-button"
                class="button-unbookmark text-white bg-contain bg-no-repeat object-contain h-[6cqw] w-[24cqw] font-bold text-[2.4cqw] pl-[6.4cqw] flex items-center select-none cursor-pointer"
                style="color: #ffffff"
            >
                GEMERKT
            </div>`;
    } else {
        bookmarkButtonBlock = `
            <div id="bookmark-button"
                class="button-bookmark bg-contain bg-no-repeat object-contain h-[6cqw] w-[24cqw] font-bold text-[2.4cqw] pl-[6.4cqw] flex items-center select-none cursor-pointer"
                style="color: ${novel.novelColor}"
            >
                MERKEN
            </div>`;
    }

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

                    ${bookmarkButtonBlock}
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

    this.querySelector('#bookmark-button').addEventListener('click', (event) => {
        // Stop bubbling so the document handler doesn't close the bubble on toggle
        event.stopPropagation();
        this.toggleBookmarked(novel.name);

        const btn = this.querySelector('#bookmark-button');
        if (this.isBookmarked(novel.name)) {
            btn.classList.remove('button-bookmark');
            btn.classList.add('button-unbookmark', 'text-white');
            btn.textContent = 'GEMERKT';
            btn.style.color = '#ffffff';
        } else {
            btn.classList.remove('button-unbookmark', 'text-white');
            btn.classList.add('button-bookmark');
            btn.textContent = 'MERKEN';
            btn.style.color = novel.novelColor;
        }

        refreshHexBookmarkMarker.call(this, novel.name);
        console.log(`Novel "${novel.name}" bookmarked: ${this.isBookmarked(novel.name)}`);
    });
}

// Add or remove the hex bookmark marker
export function refreshHexBookmarkMarker(novelName) {
    const hex = this.querySelector(`#novel-hexes [data-id="${CSS.escape(novelName)}"]`);
    if (!hex) return;
    hex.querySelector('.hex-bookmarked-marker')?.remove();
    if (!this.isBookmarked(novelName)) {
        return;
    }
    const el = document.createElement('div');
    el.className = 'hex-bookmarked-marker';
    el.setAttribute('role', 'presentation');
    const svg = hex.querySelector('svg');
    if (svg) {
        svg.insertAdjacentElement('afterend', el);
    } else {
        hex.appendChild(el);
    }
}

export function removeBubble() {
    const bubble = document.getElementById('bubble');
    bubble.replaceChildren();
}

export function bubbleAnimation(destination) {

    let frame = 0;
    let animationLength = 20;
    this.scrollingVelocity = 0;
    let velocity = (destination - this.bgPos)/animationLength;


    const animate = () => {
        this.bgPos += velocity;
        this.boundMovedElements();

        if (++frame < animationLength) {
            requestAnimationFrame(animate);
        } else {
            this.bgPos = destination;
            this.boundMovedElements();
        }
    }
    requestAnimationFrame(animate);
}