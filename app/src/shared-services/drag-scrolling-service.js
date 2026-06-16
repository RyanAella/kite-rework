/**
 * Adds the ability to scroll by dragging.
 * @param {HTMLElement} scrollBox The Container the scrolling functionality will be added to
 */
export function addDragScrolling(scrollBox) {
  let isDown = false;
  let startY;
  let scrollTop;

  scrollBox.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollBox.classList.add('active');
    startY = e.pageY - scrollBox.offsetTop;
    scrollTop = scrollBox.scrollTop;
  });

  scrollBox.addEventListener('mouseleave', () => {
    isDown = false;
  });

  scrollBox.addEventListener('mouseup', () => {
    isDown = false;
  });

  scrollBox.addEventListener('mousemove', (e) => {
    if (!isDown) return; 
    const y = e.pageY - scrollBox.offsetTop;
    const move = (y - startY);
    scrollBox.scrollTop = scrollTop - move;
  });
}