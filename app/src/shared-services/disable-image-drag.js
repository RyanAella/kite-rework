export function diasableImageDragging() {
// Event-Delegation auf dem gesamten Dokument
      document.addEventListener('dragstart', (event) => {
        // Prüfen, ob das Ziel des Drags ein Bild ist
        if (event.target.tagName === 'IMG') {
          event.preventDefault(); // Verbietet die Standard-Aktion des Browsers
        }
      });
}