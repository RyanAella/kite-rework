/**
 * Plays the Amazed Animation.
 * @param {*} styles References to the styles of all parts of the character
 */
export function animationAmazed(styles) {
  const maxUp = 20;
  const speedFactor = 1.7;
  let frame = 0;
  
  let originPositions = styles.map(style => parseInt(style.top, 10));

  const animate = () => {
    
    styles.forEach((style, index) => {
      style.top = `${originPositions[index] - maxUp + Math.abs(maxUp - frame*speedFactor)}cqw`;
    });
    if((++frame) <= 2*maxUp/speedFactor) {
      requestAnimationFrame(animate)
    } else {
      // Reset to derfault values
      styles.forEach((style, index) => {
        style.top = `${originPositions[index]}cqw`
      });
    }
  }
  requestAnimationFrame(animate);
}
