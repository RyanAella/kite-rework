import { moveElements } from './move-elements-service.js';

export function playIntroAnimation(hexScrollingFactor, viewportSize, hexSizeX) {
    const duration = 3000; // Gesamtdauer der Animation in Millisekunden
    const amplitude = 2500; // Maximale Auslenkung in bgPos-Einheiten
    const startTime = performance.now();

    const animate = (currentTime) => {
        // Abbruchbedingung: Wenn der Nutzer interagiert oder das Flag gelöscht wurde
        if (!this.isAnimatingIntro || this.isDown) return; 

        const elapsed = currentTime - startTime;
        const progress = elapsed / duration; // Normalisiert auf 0.0 bis 1.0

        if (progress < 1) {
            // Eine volle Sinus-Welle (0 bis 2*PI):
            // Start (0) -> Rechts (+) -> Mitte (0) -> Links (-) -> Ziel (0)
            this.bgPos = Math.sin(progress * Math.PI * 2) * amplitude;
            this.boundMovedElements();
            requestAnimationFrame(animate);
        } else {
            // Animation beendet: Exakt auf den Startpunkt zurücksetzen
            this.bgPos = 0;
            this.boundMovedElements();
            this.isAnimatingIntro = false;
        }
    };

    requestAnimationFrame(animate);
    this.sceneManager.enterFirstTime = false;
}