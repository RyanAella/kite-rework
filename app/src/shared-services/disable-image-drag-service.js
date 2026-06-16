/**
 * Prevents Images from being dragged
 */
export function diasableImageDragging() {
  document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG') {
      event.preventDefault(); // Prevents the defaullt action of the Browser
    }
  });
}