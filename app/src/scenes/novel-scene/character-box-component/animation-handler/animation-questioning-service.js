/**
 * Plays the Questioning Animation.
 * @param {*} styles References to the styles of all parts of the character
 */
export function animationQuestioning(styles) {

  const maxRotate = 5;
  const speedFactor = 0.15;
  let frame = 0;

  const animate = () => {
    styles.forEach(style => {
      style.rotate = `${maxRotate - Math.abs(maxRotate - frame*speedFactor)}deg`;
    });
    if((++frame) <= 2*maxRotate/speedFactor) {
      requestAnimationFrame(animate)
    } else {
      // Reset to derfault values
      styles.forEach(style => {
        style.rotate = `0deg`;
      });
    }
  }
  requestAnimationFrame(animate);
}