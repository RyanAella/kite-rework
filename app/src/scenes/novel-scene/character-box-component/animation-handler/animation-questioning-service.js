export function animationQuestioning(style, characterInfo) {
  console.log("Starting animation Questioning");
  const maxRotate = 5;
  const speedFactor = 0.15;
  let frame = 0;

  const animate = () => {
    console.log("Questioning animation frame " + frame);
    style.rotate = `${maxRotate - Math.abs(maxRotate - frame*speedFactor)}deg`;
    
    
    if((++frame) <= 2*maxRotate/speedFactor) {requestAnimationFrame(animate)}
    else {
    style.rotate = `0deg`;
    }
  }
  requestAnimationFrame(animate);
}