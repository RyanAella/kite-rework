// Styling classes for the consent checkbox box
const BOX_CLASSES =
  "mt-[0.25cqw] flex h-[5.8cqw] w-[5.8cqw] shrink-0 items-center justify-center " +
  "rounded-[0.2cqw] border-[0.35cqw] border-white bg-white " +
  "peer-checked:[&_img]:opacity-100";

// PNG is light-colored; force a black mark on the white box
const CHECK_IMG_CLASSES =
  "h-[3.4cqw] w-[3.4cqw] shrink-0 object-contain opacity-0 brightness-0";

// Build the consent checkbox HTML
export function buildConsentCheckbox({ id, label }) {
  return `
    <label class="flex w-full items-start gap-[7cqw] text-[3.6cqw] leading-snug">
      <input type="checkbox" id="${id}" class="peer sr-only" />
      <span class="${BOX_CLASSES}" aria-hidden="true">
        <img
          src="assets/Images/Buttons/Checkmark.png"
          alt=""
          class="${CHECK_IMG_CLASSES}"
        />
      </span>
      <span class="select-none pt-[0.15cqw]">${label}</span>
    </label>
  `;
}