import "../shared-components/information-popup-component.js";
import { playAudio, TTSRead } from "./audio-playing-service.js";

/**
 * Enable the popup layer.
 * @param {*} container 
 */
export function enablePopupLayer(container) {
  playAudio("SFX_Textpopup_2");
  TTSRead(container.querySelector("#popup-information-text").innerHTML);
  container.classList.remove("pointer-events-none");
}

/**
 * Disable the popup layer.
 * @param {*} container 
 */
export function disablePopupLayer(container) {
  container.classList.add("pointer-events-none");
}

/**
 * Show the pinned modal.
 * @param {*} container 
 * @param {*} overlayElement 
 */
export function showPinnedModal(container, overlayElement) {
  enablePopupLayer(container);
  overlayElement.classList.remove("hidden");
}

/**
 * Hide the pinned modal.
 * @param {*} container 
 * @param {*} overlayElement 
 */
export function hidePinnedModal(container, overlayElement) {
  overlayElement.classList.add("hidden");
  disablePopupLayer(container);
}

/**
 * Show the swap modal.
 * @param {*} container 
 * @param {*} overlayElement 
 */
export function showSwapModal(container, overlayElement) {
  container.replaceChildren(overlayElement);
  enablePopupLayer(container);
}

/**
 * Hide the swap modal.
 * @param {*} container 
 */
export function hideSwapModal(container) {
  container.replaceChildren();
  disablePopupLayer(container);
}

/**
 * Create the information popup component.
 * @param {*} message 
 * @returns 
 */
export function createInformationPopup(message) {
  const popup = document.createElement("information-popup-component");
  setInformationText(popup, message);
  return popup;
}

/**
 * Setter for the text in the popUp.
 * @param {*} popup reference to the popUP
 * @param {*} message the new mesage
 */
export function setInformationText(popup, message) {
  if (message != null) popup.setInformationText(String(message));
}