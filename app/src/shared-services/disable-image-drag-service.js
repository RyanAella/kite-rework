/**
 * Prevents Images from being dragged
 */
export function disableImageDragging() {
  document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG') {
      event.preventDefault(); // Prevents the default action of the Browser
    }
  });
}