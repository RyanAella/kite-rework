export async function playNumberBlinkSequence() {
    // Hilfsfunktion, um den Thread zu pausieren
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Wir holen uns ALLE Spans, nicht nur den ersten
    const numberSpans = document.querySelectorAll('.bubble-number');

    // Wir iterieren über jede Bubble auf dem Spielfeld
    for (let span of numberSpans) {
        const newValue = span.getAttribute('data-new-value');
        const oldValue = span.innerText;

        // Wir lassen die Zahl nur blinken, wenn sich der Wert geändert hat
        if (newValue !== oldValue) {
            
            // 3x Blinken
            for (let i = 0; i < 3; i++) {
                span.style.opacity = '0'; // Unsichtbar
                await sleep(300);         
                
                span.style.opacity = '1'; // Sichtbar
                await sleep(300);         
            }

            // Danach neue Zahl setzen
            span.innerText = newValue;
        }
    }
}