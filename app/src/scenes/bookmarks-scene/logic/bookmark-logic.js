import { bookmarkedNovelStore } from "../../../services/store-service.js";
import {
  BOOKMARK_HEX_W_CQW,
  BOOKMARK_HEX_H_CQW,
  buildBookmarkHoneycombModel,
} from "./honeycomb-logic.js";

// Load the catalogue and return the novels that appear in bookmarks (excludes „Einstieg“)
export async function fetchBookmarkedSelectableNovels() {
  const response = await fetch("assets/json/novels.json");
  const data = await response.json();
  const allNovels = data["visualNovels"];
  const selectableNovels = allNovels.filter((n) => n.name !== "Einstieg");
  const validNames = selectableNovels.map((n) => n.name);

  const bookmarkedNames = bookmarkedNovelStore.load(validNames);
  return selectableNovels.filter((n) => bookmarkedNames.has(n.name));
}

// Create the absolute bookmark hex markup for a novel
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
export function renderBookmarkHexGrid(bookmarksScene, novels) {
  const grid = bookmarksScene.querySelector("#hex-grid");
  if (!grid) return;

  const model = buildBookmarkHoneycombModel(novels);
  if (model == null) {
    grid.innerHTML = "";
    return;
  }

  const { placements, boxWidth, boxHeight } = model;

  // Create the tiles for the hex grid
  const tiles = placements
    .map(({ novel, left, top }) =>
      createAbsoluteBookmarkHexMarkup(novel, left, top),
    )
    .join("");

  // Render the hex grid
  grid.innerHTML =
    `<div class="relative mx-auto shrink-0 overflow-visible"` +
    ` style="width:${boxWidth}cqw;height:${boxHeight}cqw">${tiles}</div>`;
}

// Attach the bookmark hex navigate listeners
export function attachBookmarkHexNavigateListeners(bookmarksScene, novels) {
  const grid = bookmarksScene.querySelector("#hex-grid");
  if (!grid) return;

  for (const novel of novels) {
    const hex = grid.querySelector(`[data-id="${CSS.escape(novel.name)}"]`);
    if (!hex) continue;

    hex.classList.add("cursor-pointer", "select-none");
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

export async function initBookmarksHoneycomb(bookmarksScene) {
  const novelsToShow = await fetchBookmarkedSelectableNovels();
  renderBookmarkHexGrid(bookmarksScene, novelsToShow);
  attachBookmarkHexNavigateListeners(bookmarksScene, novelsToShow);
}
