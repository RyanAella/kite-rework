export function animationScared(style, characterInfo) {
  console.log("Starting animation Scared");
  const maxRad = 10;
  const duration = 100;
  const speedFactor = 0.2;
  const radDecreaseFactor = 1.03
  let frame = 0;

  const animate = () => {
    style.left = `${characterInfo["positionX"] - maxRad * Math.cos(speedFactor * frame)/Math.pow(radDecreaseFactor, frame)}cqw`;
    style.top = `${characterInfo["positionY"] + maxRad * Math.sin(speedFactor * frame)/Math.pow(radDecreaseFactor, frame)}cqw`;
    console.log(`Animation scared: frame ${frame} | left: ${style.left} | top : ${style.top}`);


    if((++frame) <= duration) {requestAnimationFrame(animate)}
    else {
    style.left = `${characterInfo["positionX"]}cqw`;
    style.top = `${characterInfo["positionY"]}cqw`;
    }
  }
  requestAnimationFrame(animate);
}