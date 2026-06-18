/**
 * Creates a Hexagon Element.
 * @param {number} posX horizontal position of the Hexagon
 * @param {*} posY vertical position of the hexagon
 * @param {Object} novel the novel this hexagon referes to
 * @param {*} isInfo whether this Hexagon linkes to the AboutKiteScene rather than to a novel
 * @param {boolean} isBookmarked whether the Hexagon shall have a bookmared flag
 * @param {*} archiveData 
 * @param {*} args 
 * @returns the newly created hex
 */
export function createHex(posX, posY, novel, isInfo = false, isBookmarked, archiveData, args) {
  const left = posX / 10;
  const top = (posY / 10) + 50;
  const w = 29.6; // 296/10
  const h = 26.6; // 266/10

  let novelname = novel.name;
  let keyValuePair = Object.entries(archiveData).find(([key, value]) => novelname == key);
  let value = keyValuePair ? keyValuePair[1] : null;
  const numberOfPlayedDiaogues = value != null ? value.length : 0;
  const returnFromCompletion = args && args.fromCompletion && args.novelName == novelname;
  const displayCount = (returnFromCompletion && numberOfPlayedDiaogues > 0) ? 
    (numberOfPlayedDiaogues - 1) : numberOfPlayedDiaogues;

  // Bookmark Marker: only show for non-info hexes and if the novel is bookmarked
  const bookmarkMarker = (!isInfo && isBookmarked(novel.name))
    ? '<div class="hex-bookmarked-marker" role="presentation"></div>'
    : '';

  const counterBubble = (value != null) ?
    `
        <div class="absolute bottom-[2.5cqw] left-1/2 -translate-x-1/2 flex justify-center items-center w-[5cqw] h-[5cqw] bg-[#fe5d03] rounded-full text-white font-mono z-20 text-[3.4cqw]">
          <span class="bubble-number" data-new-value="${numberOfPlayedDiaogues}">${displayCount}</span>
        </div>
    ` : '';

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
      <div class="relative z-10 w-[80%] text-center text-white text-[3.6cqw] font-normal select-none pointer-events-none">
        ${novel.title}
      </div>
      ${counterBubble}
    </div>
  `;
}