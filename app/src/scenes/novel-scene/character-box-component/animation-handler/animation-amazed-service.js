export function animationAmazed(styles, characterInfo, characterObjectSync) {
  console.log("Starting animation Amazed");
  const maxUp = 20;
  const speedFactor = 1.7;
  let frame = 0;
  
  let originPositions = styles.map(style => parseInt(style.top, 10));
  console.log(originPositions);

  const animate = () => {
  console.log("Amazed animation frame " + frame);
    
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
