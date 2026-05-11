// Datenschutz info popup: same layout/behavior as settings-scene.js popup (different copy).

const DEFAULT_INFO_TEXT =
  "Mit diesem Button kannst du deine App zurücksetzen. Sämtliche Daten, welche durch dein Spielen entstanden sind, werden gelöscht.";

// Create the Dataprivacy Info Popup
function createDataprivacyInfoPopup(toolbar) {
  if (!toolbar) return null;

  const popup = document.createElement("div");
  popup.className =
    "col-start-1 row-start-1 w-full h-full bg-white/50 flex items-center justify-center";
  popup.innerHTML = `
      <div class="w-[85cqw] h-[43cqw] rounded-[2cqw] bg-[#132034] flex flex-col items-center">
        <div class="w-[80cqw] text-white text-[5cqw] text-center p-[2cqw] border-b-[0.5cqw] mb-[5cqw]">INFORMATION</div>
        <p id="popup-information-text" class="w-[80cqw] h-[40cqw] text-white text-[3cqw]"></p>
        <div id="popup-button" class="w-[30cqw] h-[20cqw] border-[0.2cqw] flex items-center justify-center text-[3cqw] text-white mt-[2cqw] mb-[2cqw]">OK</div>
      </div>
    `;

  const text = String((toolbar && toolbar.infoText) || DEFAULT_INFO_TEXT);
  const textEl = popup.querySelector("#popup-information-text");
  if (textEl) textEl.textContent = text;

  return popup;
}

// Attach the Dataprivacy Info Popup to the root element
export function attachDataprivacyInfoPopup(rootEl, toolbar) {
  const popup = createDataprivacyInfoPopup(toolbar);
  if (!popup) return;

  const popupContainer = rootEl.querySelector("#document-popup-container");
  if (!popupContainer) return;

// Hide the Dataprivacy Info Popup
const hidePopup = () => {
    popupContainer.replaceChildren();
    popupContainer.classList.add("pointer-events-none");
  };

// Show the Dataprivacy Info Popup
const showPopup = () => {
    popupContainer.replaceChildren(popup);
    popupContainer.classList.remove("pointer-events-none");
  };

// Add event listener to the popup button
  popup.querySelector("#popup-button")?.addEventListener("click", () => {
    hidePopup();
  });

// Add event listener to the open button
  const openBtn = rootEl.querySelector("[data-info-open]");
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showPopup();
    });
  }
}
