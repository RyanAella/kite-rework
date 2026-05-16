// Information popup service for showing and hiding the information popup component
import "../shared-components/information-popup-component.js";

// Enable the popup layer
export function enablePopupLayer(container) {
  container.classList.remove("pointer-events-none");
}

// Disable the popup layer
export function disablePopupLayer(container) {
  container.classList.add("pointer-events-none");
}

// Show the pinned modal
export function showPinnedModal(container, overlayElement) {
  enablePopupLayer(container);
  overlayElement.classList.remove("hidden");
}

// Hide the pinned modal
export function hidePinnedModal(container, overlayElement) {
  overlayElement.classList.add("hidden");
  disablePopupLayer(container);
}

// Show the swap modal
export function showSwapModal(container, overlayElement) {
  container.replaceChildren(overlayElement);
  enablePopupLayer(container);
}

// Hide the swap modal
export function hideSwapModal(container) {
  container.replaceChildren();
  disablePopupLayer(container);
}

// Create the information popup component
export function createInformationPopup(message) {
  const popup = document.createElement("information-popup-component");
  if (message != null) popup.setInformationText(String(message));
  return popup;
}
