// Bookmark hex width and height in cqw
export const BOOKMARK_HEX_W_CQW = 29.6;
export const BOOKMARK_HEX_H_CQW = 26.6;
const BOOKMARK_HEX_GAP_CQW = 1.2;

const COL_STEP_CQW = BOOKMARK_HEX_W_CQW * 0.82 + BOOKMARK_HEX_GAP_CQW; // Horizontal step between neighbouring columns
const ROW_STEP_CQW = BOOKMARK_HEX_H_CQW + BOOKMARK_HEX_GAP_CQW; // Vertical step between neighbouring rows in one column
const MID_STAGGER_CQW = ROW_STEP_CQW * 0.5; // This is the stagger for the odd columns

// Count the number of columns for the bookmark honeycomb
export function bookmarkColumnCount(n) {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  return 3;
}

// Split the items into columns round-robin
export function bookmarkColumnsFromItems(items, columnCount) {
  const cols = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    cols[i % columnCount].push(item);
  });
  return cols;
}

// Layout the honeycomb placements
export function layoutHoneycombPlacements(columns) {
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
export function honeycombBoxHeight(columns) {
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
export function honeycombBoxWidth(columnCount) {
  if (columnCount <= 1) return BOOKMARK_HEX_W_CQW;
  return Math.max(0, columnCount - 1) * COL_STEP_CQW + BOOKMARK_HEX_W_CQW;
}

// Build the bookmark honeycomb model
export function buildBookmarkHoneycombModel(novels) {
  if (novels.length === 0) {
    return null;
  }

  const colCount = bookmarkColumnCount(novels.length);
  const columns = bookmarkColumnsFromItems(novels, colCount);

  return {
    colCount,
    columns,
    placements: layoutHoneycombPlacements(columns),
    boxWidth: honeycombBoxWidth(colCount),
    boxHeight: honeycombBoxHeight(columns),
  };
}
