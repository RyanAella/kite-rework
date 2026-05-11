export function animationAmazed(style, characterInfo) {
  console.log("Starting animation Amazed");
  const maxUp = 20;
  const speedFactor = 1.7;
  let frame = 0;

  const animate = () => {
    console.log("Amazed animation frame " + frame);
    style.top = `${characterInfo["positionY"] - maxUp + Math.abs(maxUp - frame*speedFactor)}cqw`;

    if((++frame) <= 2*maxUp/speedFactor) {requestAnimationFrame(animate)}
    else {
      style.top = `${characterInfo["positionY"]}cqw`
    }
  }
  requestAnimationFrame(animate);
}
