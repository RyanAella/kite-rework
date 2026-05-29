export function createHex(posX, posY, novel, isInfo = false, isBookmarked) {
    const left = posX / 10;
    const top = (posY / 10) + 50;
    const w = 29.6; // 296/10
    const h = 26.6; // 266/10

    // Bookmark Marker: only show for non-info hexes and if the novel is bookmarked
    const bookmarkMarker = (!isInfo && isBookmarked(novel.name))
        ? '<div class="hex-bookmarked-marker" role="presentation"></div>'
        : '';

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
            ${bookmarkMarker}
            <div class="relative z-10 w-[80%] text-center text-white text-[3.6cqw] font-semibold select-none pointer-events-none">
                ${novel.title}
            </div>
        </div>
    `;
}