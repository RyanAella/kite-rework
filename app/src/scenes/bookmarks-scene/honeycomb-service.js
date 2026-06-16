// Hexagon tile sizes and the shared hex shape image.
const HEX_W_CQW = 29.6;
const HEX_H_CQW = 26.6;
const HEX_GAP_CQW = 1.2;
const HEX_SHAPE_SRC = "assets/Images/FoundersBubble/Novel_Shape.png";

const COLUMNS = 3;
const COLUMN_FILL_ORDER = [0, 2, 1];

const COL_STEP_CQW = HEX_W_CQW * 0.82 + HEX_GAP_CQW; // horizontal step between columns
const ROW_STEP_CQW = HEX_H_CQW + HEX_GAP_CQW; // vertical step within a column
const MID_STAGGER_CQW = ROW_STEP_CQW * 0.5; // vertical offset of the middle column
const BOX_WIDTH_CQW = (COLUMNS - 1) * COL_STEP_CQW + HEX_W_CQW;

// Drifts the middle column half a row for the honeycomb effect.
const columnStagger = (colIdx) => (colIdx === 1 ? MID_STAGGER_CQW : 0);

/**
 * Distributes novels into the fixed columns in left, right, middle order.
 * @param {Array} novels - The novels to distribute.
 * @returns {Array} The distributed novels.
 */
function columnsFromNovels(novels) {
  const cols = Array.from({ length: COLUMNS }, () => []);
  novels.forEach((novel, i) => {
    cols[COLUMN_FILL_ORDER[i % COLUMNS]].push(novel);
  });
  return cols;
}

/**
 * Builds the honeycomb model for the bookmarks scene.
 * @param {Array} novels - The novels to build the honeycomb model for.
 * @returns {Object} The honeycomb model.
 */
function buildHoneycombModel(novels) {
  if (novels.length === 0) return null;

  const placements = [];
  let boxHeight = HEX_H_CQW;

  columnsFromNovels(novels).forEach((novelsInCol, colIdx) => {
    const stagger = columnStagger(colIdx);
    novelsInCol.forEach((novel, rowIdx) => {
      const top = stagger + rowIdx * ROW_STEP_CQW;
      placements.push({ novel, left: colIdx * COL_STEP_CQW, top });
      boxHeight = Math.max(boxHeight, top + HEX_H_CQW);
    });
  });

  return { placements, boxWidth: BOX_WIDTH_CQW, boxHeight };
}

/**
 * Builds the markup for a single positioned hex tile.
 * @param {Object} novel - The novel to build the markup for.
 * @param {number} left - The left position of the tile.
 * @param {number} top - The top position of the tile.
 * @returns {string} The markup for the tile.
 */
function hexTileMarkup(novel, left, top) {
  return `
    <div data-id="${novel.name}"
      class="absolute flex shrink-0 items-center justify-center"
      style="left:${left}cqw;top:${top}cqw;width:${HEX_W_CQW}cqw;height:${HEX_H_CQW}cqw;"
    >
      <div
        class="absolute inset-0 z-0 h-full w-full"
        style="background-color:${novel.novelColor};-webkit-mask:url('${HEX_SHAPE_SRC}') center/contain no-repeat;mask:url('${HEX_SHAPE_SRC}') center/contain no-repeat;"
      ></div>
      <div class="relative z-10 w-[80%] text-center text-white text-[3.6cqw] font-semibold leading-tight pointer-events-none">
        ${novel.title}
      </div>
    </div>
  `;
}

/**
 * Navigates to the novel scene for the clicked tile.
 * @param {Object} bookmarksScene - The bookmarks scene.
 * @param {Object} novel - The novel to navigate to.
 */
function navigateToNovel(bookmarksScene, novel) {
  bookmarksScene.dispatchEvent(
    new CustomEvent("sm-switch-scene", {
      detail: { scene: "novel-scene", args: { novel } },
      bubbles: true
    }),
  );
}

/**
 * Initializes the honeycomb component for the bookmarks scene.
 * @param {Object} bookmarksScene - The bookmarks scene.
 * @param {Array} novels - The novels to initialize the honeycomb component for.
 */
export function initHoneycombComponent(bookmarksScene, novels) {
  const grid = bookmarksScene.querySelector("#hex-grid");
  if (!grid) return;

  const model = buildHoneycombModel(novels);
  if (!model) {
    grid.innerHTML = "";
    return;
  }

  const { placements, boxWidth, boxHeight } = model;
  const tiles = placements
    .map(({ novel, left, top }) => hexTileMarkup(novel, left, top))
    .join("");

  grid.innerHTML =
    `<div class="relative mx-auto shrink-0 overflow-visible"` +
    ` style="width:${boxWidth}cqw;height:${boxHeight}cqw">${tiles}</div>`;

  for (const { novel } of placements) {
    const hex = grid.querySelector(`[data-id="${CSS.escape(novel.name)}"]`);
    if (!hex) continue;
    hex.classList.add("select-none");
    hex.addEventListener("click", () => navigateToNovel(bookmarksScene, novel));
  }
}
