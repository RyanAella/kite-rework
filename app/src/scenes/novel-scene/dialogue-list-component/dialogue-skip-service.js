const POST_TYPING_DELAY_MS = 750; // 750ms is the delay after the typewriter animation completes
const TYPEWRITER_INTERVAL_MS = 21; // 21ms is the interval at which the typewriter animation runs

// WeakMap to store the active animations
const activeAnimations = new WeakMap(); 

// Runs the typewriter animation
export function runTypewriterAnimation(messageContainer, { text, typewriterBox, resolve, onBeforeStart }) {
  const animation = {
    text,
    typewriterBox,
    resolve,
    typeInterval: null,
    postDelayTimeout: null,
    done: false,
  };

  requestAnimationFrame(() => {
    onBeforeStart?.();

    /* 
      Render the full text up front, split into a visible "typed" part and a
      hidden "untyped" part. The untyped part keeps its layout space (visibility
      hidden), so line breaks match the final text from the start and revealing
      characters never causes the text to reflow or flicker onto the next line. 
    */
    typewriterBox.textContent = "";
    const typedSpan = document.createElement("span");
    const untypedSpan = document.createElement("span");
    untypedSpan.className = "invisible";
    untypedSpan.textContent = text;
    typewriterBox.appendChild(typedSpan);
    typewriterBox.appendChild(untypedSpan);
    animation.typedSpan = typedSpan;
    animation.untypedSpan = untypedSpan;

    let charIndex = 0;
    // Set the interval for the typewriter animation
    animation.typeInterval = setInterval(() => {

      // If the character index is less than the text length, reveal the next character
      if (charIndex < text.length) {
        charIndex++;
        typedSpan.textContent = text.slice(0, charIndex);
        untypedSpan.textContent = text.slice(charIndex);
      } else {

        // Clear the interval when the text is complete
        clearInterval(animation.typeInterval);
        animation.typeInterval = null;
        typedSpan.textContent = text;
        untypedSpan.textContent = "";

        // Set the post delay timeout
        animation.postDelayTimeout = setTimeout(() => {
          if (animation.done) return;
          animation.done = true;

          // If the animation is the active animation, delete it from the active animations map
          if (activeAnimations.get(messageContainer) === animation) {
            activeAnimations.delete(messageContainer);
          }

          // Resolve the promise after the post delay timeout
          resolve();
        }, POST_TYPING_DELAY_MS);
      }
    }, TYPEWRITER_INTERVAL_MS);

    // Set the animation in the active animations map
    activeAnimations.set(messageContainer, animation);
  });
}

// Skips the active animation
export function skipActiveAnimation(messageContainer) {
  const animation = activeAnimations.get(messageContainer);
  if (!animation || animation.done) return false;

  clearInterval(animation.typeInterval);
  clearTimeout(animation.postDelayTimeout);
  animation.typewriterBox.textContent = animation.text;
  animation.done = true;
  activeAnimations.delete(messageContainer);
  animation.resolve();
  return true;
}

// Checks if there are visible choices
export function hasVisibleChoices(choiceContainer) {
  return choiceContainer.querySelector("button") !== null;
}
// Try to skip the dialogue animation if there are no visible choices
export function trySkipDialogueAnimation({ messageContainer, choiceContainer }) {
  if (hasVisibleChoices(choiceContainer)) return;
  skipActiveAnimation(messageContainer);
}

// Attach the dialogue skip on outside click event to the background
export function attachDialogueSkipOnOutsideClick(background, dialogueList) {
  background.addEventListener("click", (event) => {
    if (dialogueList.contains(event.target)) return;
    trySkipDialogueAnimation(dialogueList);
  });
}
