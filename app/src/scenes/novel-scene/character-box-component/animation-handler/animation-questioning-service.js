export function animationQuestioning(styles, characterInfo) {
  console.log("Starting animation Questioning");
  const maxRotate = 5;
  const speedFactor = 0.15;
  let frame = 0;

  const animate = () => {
    styles.forEach(style => {
      console.log("Questioning animation frame " + frame);
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