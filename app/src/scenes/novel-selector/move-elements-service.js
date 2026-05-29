const bg2Scrolling = 48;
const bg1Scrolling = 10;

const bg2ScrollingFactor = 0.0005;
const bg1ScrollingFactor = 0.001;

const velocityDragFactor = 5;

export function moveElements(hexScrollingFactor, viewportSize, hexSizeX) {
    
    document.getElementById('bg-1').style = `background-position: ${bg1Scrolling + this.bgPos * bg1ScrollingFactor}% 0%;`;
    document.getElementById('bg-2').style = `background-position: ${bg2Scrolling + this.bgPos * bg2ScrollingFactor}% 0%;`;

    let novelHexes = this.querySelector('#novel-hexes');
    novelHexes.style.transform = `translateX(${this.bgPos * -hexScrollingFactor / 10}cqw)`;

    const scaledFirstHexPos = (this.firstHexPos - (viewportSize-hexSizeX)/2) / hexScrollingFactor;
    const scaledLastHexPos = (this.lastHexPos - (viewportSize-hexSizeX)/2) / hexScrollingFactor;

    if(this.bgPos < scaledFirstHexPos) {
        this.scrollingVelocity = 30 + Math.abs(scaledFirstHexPos - this.bgPos)/30;
    } else if(this.bgPos > scaledLastHexPos) {
        this.scrollingVelocity = -(30 + Math.abs(scaledLastHexPos - this.bgPos)/30);
    }

    if(this.scrollingVelocity != 0 && !this.isDown) {
        console.log("Scrolling with velocity " + this.scrollingVelocity);
        this.bgPos += this.scrollingVelocity
        const velocityDrag = velocityDragFactor + Math.abs(this.scrollingVelocity/30)
        if(this.scrollingVelocity > 0) {
            this.scrollingVelocity = this.scrollingVelocity >= velocityDrag ? this.scrollingVelocity - velocityDrag : 0
        } else {
            this.scrollingVelocity = this.scrollingVelocity <= -velocityDrag ? this.scrollingVelocity + velocityDrag : 0
        }
        requestAnimationFrame(this.boundMovedElements);
    }
}