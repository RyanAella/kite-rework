// Max pointer movement (px) still treated as a tap rather than a drag.
export const TAP_MOVE_THRESHOLD_PX = 10;

// Fires `onTap` on tap only; ignores gestures that move beyond `moveThresholdPx`
export function addOpenOnTapOnly(target, onTap, moveThresholdPx = TAP_MOVE_THRESHOLD_PX) {
    target.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        const startX = e.clientX;
        const startY = e.clientY;
        let moved = false;

        // Checks if the pointer has moved beyond the moveThresholdPx
        const onMove = (ev) => {
            if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > moveThresholdPx) {
                moved = true;
            }
        };

        // Checks if the pointer has been released and if it has not moved beyond the moveThresholdPx
        const onEnd = (ev) => {
            if (ev.pointerId !== e.pointerId) return;
            window.removeEventListener('pointermove', onMove, true);
            window.removeEventListener('pointerup', onEnd, true);
            window.removeEventListener('pointercancel', onEnd, true);
            if (ev.button === 0 && !moved) {
                onTap(ev);
            }
        };
        window.addEventListener('pointermove', onMove, true);
        window.addEventListener('pointerup', onEnd, true);
        window.addEventListener('pointercancel', onEnd, true);
    });
}

// Binds a click event to an anchor element that opens a new window in a new tab
export function bindTapOnlyExternalLink(anchorEl, url) {
    const open = () => {
        window.open(url, "_blank", "noopener,noreferrer");
    };
    anchorEl.addEventListener("click", (e) => e.preventDefault());
    anchorEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
        }
    });
    addOpenOnTapOnly(anchorEl, open);
}
