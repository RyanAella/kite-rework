import { moveElements } from './move-elements-service.js';

/**
 * Plays the novel selector into animations.
 */
export function playIntroAnimation(hexScrollingFactor, viewportSize, hexSizeX) {
  const duration = 3000; // Total time of the animation in millisconds
  const amplitude = 2500; // maximum altitude in bgPos-Units
  const startTime = performance.now();

  const animate = (currentTime) => {
    if (!this.isAnimatingIntro || this.isDown) return; 

    const elapsed = currentTime - startTime;
    const progress = elapsed / duration;

    if (progress < 1) {
      this.bgPos = Math.sin(progress * Math.PI * 2) * amplitude;
      this.boundMovedElements();
      requestAnimationFrame(animate);
    } else {
      this.bgPos = 0;
      this.boundMovedElements();
      this.isAnimatingIntro = false;
    }
  };

  requestAnimationFrame(animate);
  this.sceneManager.enterFirstTime = false;
}