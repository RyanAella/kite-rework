// Bookmark hex width and height in cqw
const BOOKMARK_HEX_W_CQW = 29.6;
const BOOKMARK_HEX_H_CQW = 26.6;
const BOOKMARK_HEX_GAP_CQW = 1.2;


const COL_STEP_CQW = BOOKMARK_HEX_W_CQW * 0.82 + BOOKMARK_HEX_GAP_CQW; // Horizontal step between neighbouring columns
const ROW_STEP_CQW = BOOKMARK_HEX_H_CQW + BOOKMARK_HEX_GAP_CQW; // Vertical step between neighbouring rows in one column
const MID_STAGGER_CQW = ROW_STEP_CQW * 0.5; // This is the stagger for the odd columns

// Calculate the number of columns for the honeycomb
function bookmarkColumnCount(n) {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  return 3;
}

// Create the columns for the honeycomb
function bookmarkColumnsFromItems(items, columnCount) {
  const cols = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    cols[i % columnCount].push(item);
  });
  return cols;
}

// Layout the honeycomb placements
function layoutHoneycombPlacements(columns) {
  const colCount = columns.length;
  const out = [];

  columns.forEach((novelsInCol, colIdx) => {
    const stagger = colCount > 1 && colIdx % 2 === 1 ? MID_STAGGER_CQW : 0;
    novelsInCol.forEach((novel, rowIdx) => {
      out.push({
        novel,
        left: colIdx * COL_STEP_CQW,
        top: stagger + rowIdx * ROW_STEP_CQW,
      });
    });
  });

  return out;
}

// Calculate the height of the honeycomb box
function honeycombBoxHeight(columns) {
  let maxBottom = 0;
  const colCount = columns.length;

  columns.forEach((novelsInCol, colIdx) => {
    if (novelsInCol.length === 0) return;
    const stagger = colCount > 1 && colIdx % 2 === 1 ? MID_STAGGER_CQW : 0;
    const bottom =
      stagger + (novelsInCol.length - 1) * ROW_STEP_CQW + BOOKMARK_HEX_H_CQW;
    maxBottom = Math.max(maxBottom, bottom);
  });

  return maxBottom || BOOKMARK_HEX_H_CQW;
}

// Calculate the width of the honeycomb box
function honeycombBoxWidth(columnCount) {
  if (columnCount <= 1) return BOOKMARK_HEX_W_CQW;
  return Math.max(0, columnCount - 1) * COL_STEP_CQW + BOOKMARK_HEX_W_CQW;
}

// Build the honeycomb model
function buildBookmarkHoneycombModel(novels) {
  if (novels.length === 0) {
    return null;
  }

  const colCount = bookmarkColumnCount(novels.length);
  const columns = bookmarkColumnsFromItems(novels, colCount);

  return {
    placements: layoutHoneycombPlacements(columns),
    boxWidth: honeycombBoxWidth(colCount),
    boxHeight: honeycombBoxHeight(columns),
  };
}

// Create the absolute bookmark hex markup
function createAbsoluteBookmarkHexMarkup(novel, leftCqw, topCqw) {
  return `
      <div data-id="${novel.name}"
        class="absolute flex shrink-0 items-center justify-center"
        style="left:${leftCqw}cqw;top:${topCqw}cqw;width:${BOOKMARK_HEX_W_CQW}cqw;height:${BOOKMARK_HEX_H_CQW}cqw;"
      >
        <svg viewBox="0 0 296 266" class="absolute inset-0 z-0 h-full w-full overflow-visible">
          <path
            d="M 96.5,0 L 209.5,0 Q 229.5,0 239.5,17.3 L 296,115.7 Q 306,133 296,150.3 L 239.5,248.7 Q 229.5,266 209.5,266 L 96.5,266 Q 76.5,266 66.5,248.7 L 10,150.3 Q 0,133 10,115.7 L 66.5,17.3 Q 76.5,0 96.5,0 Z"
            fill="${novel.novelColor}"
          />
        </svg>

        <div class="relative z-10 w-[80%] text-center text-white text-[3.6cqw] font-semibold leading-tight pointer-events-none">
          ${novel.title}
        </div>
      </div>
    `;
}

// Render the bookmark hex grid
function renderBookmarkHexGrid(bookmarksScene, novels) {
  const grid = bookmarksScene.querySelector("#hex-grid");
  if (!grid) return;

  const model = buildBookmarkHoneycombModel(novels);
  if (model == null) {
    grid.innerHTML = "";
    return;
  }

  const { placements, boxWidth, boxHeight } = model;

  const tiles = placements
    .map(({ novel, left, top }) =>
      createAbsoluteBookmarkHexMarkup(novel, left, top),
    )
    .join("");

  grid.innerHTML =
    `<div class="relative mx-auto shrink-0 overflow-visible"` +
    ` style="width:${boxWidth}cqw;height:${boxHeight}cqw">${tiles}</div>`;
}

// Attach the bookmark hex navigate listeners
function attachBookmarkHexNavigateListeners(bookmarksScene, novels) {
  const grid = bookmarksScene.querySelector("#hex-grid");
  if (!grid) return;

  for (const novel of novels) {
    const hex = grid.querySelector(`[data-id="${CSS.escape(novel.name)}"]`);
    if (!hex) continue;

    hex.classList.add("select-none");
    hex.addEventListener("click", () => {
      bookmarksScene.dispatchEvent(
        new CustomEvent("sm-switch-scene", {
          detail: {
            scene: "novel-scene",
            args: { novel },
          },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

// Initialize the honeycomb component
export function initHoneycombComponent(bookmarksScene, novels) {
  renderBookmarkHexGrid(bookmarksScene, novels);
  attachBookmarkHexNavigateListeners(bookmarksScene, novels);
}
