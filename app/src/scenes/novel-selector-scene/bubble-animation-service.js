/**
 * Plays the blinking animation of the numbers that show the number of Archive Storage Entries for a novel.
 */
export async function playNumberBlinkSequence() {

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const numberSpans = document.querySelectorAll('.bubble-number');

  for (let span of numberSpans) {
    const newValue = span.getAttribute('data-new-value');
    const oldValue = span.innerText;

    if (newValue !== oldValue) {
      
      for (let i = 0; i < 3; i++) {
        span.style.opacity = '0'; // Visabler
        await sleep(300);
        
        span.style.opacity = '1'; // Invisable
        await sleep(300);
      }

      span.innerText = newValue;
    }
  }
}