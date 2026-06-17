// Small non-interactive toast popup that fades in, stays briefly, then removes itself.
export class CopyToast extends HTMLElement {
  // Shows a toast inside the given parent element.
  static show(parent, message, duration = 2000) {
    const toast = document.createElement("copy-toast");
    toast.message = message;
    toast.duration = duration;
    parent.appendChild(toast);
    return toast;
  }

  connectedCallback() {
    // Full-scene overlay, centered, never blocks interaction.
    this.className =
      "pointer-events-none absolute inset-0 z-[200] flex items-center justify-center px-[10cqw] pt-[40cqw]";

    const box = document.createElement("div");
    box.className =
      "bg-[#132034] text-white font-bold text-center text-[4cqw] leading-[5.5cqw] rounded-[2cqw] px-[6cqw] py-[5cqw] max-w-[80%] transition-opacity duration-300 opacity-0";
    box.innerText = this.message || "";
    this.appendChild(box);

    // Fade in on the next frame so the transition runs.
    requestAnimationFrame(() => {
      box.classList.replace("opacity-0", "opacity-100");
    });

    const duration = this.duration ?? 2000;
    setTimeout(() => {
      box.classList.replace("opacity-100", "opacity-0");
      setTimeout(() => this.remove(), 300);
    }, duration);
  }
}

customElements.define("copy-toast", CopyToast);
