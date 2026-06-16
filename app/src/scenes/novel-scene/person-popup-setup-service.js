import { PersonPopUp } from "../../shared-components/person-popup-component.js";
import { novelStateStore } from "../../shared-services/store-service.js";

// This service is responsible for setting up the pause and continue pop-ups and buttons.

// Styling classes for the pause and continue pop-ups and buttons
const PAUSE_OVERLAY_CLASS =
  "absolute inset-0 bg-black/50 z-[100] hidden p-[4cqw] transition-opacity duration-300";

const CONTINUE_OVERLAY_CLASS =
  "absolute inset-0 bg-black/50 z-[100] hidden transition-opacity duration-200";

const CONTINUE_BUTTON_CLASS =
  "py-[2.4cqw] px-[0.8cqw] rounded-[0.6cqw] font-bold text-[2.8cqw] text-center border-[0.3cqw] border-white bg-white";


/**
 * Check if the novel is an intro novel
 */
export function isIntroNovel(novel) {
  return novel["disablePauseMenu"] === true;
}

/**
 * Create the pause pop-up.
 */
export function createPausePopUp(novel, { onLeaveNovel, onResume, onPause, onFinish }) {
  const popUp = PersonPopUp.create();
  const intro = isIntroNovel(novel);

  popUp.config = {
    novelColor: novel["novelColor"],
    title: "Was möchtest du tun?",
    descriptions: buildPauseDescriptions(intro),
    buttons: buildPauseButtons(popUp, intro, { onLeaveNovel, onResume, onPause, onFinish }),
    overlayClass: PAUSE_OVERLAY_CLASS,
  };

  return popUp;
}

/**
 * Build the descriptions for the pause pop-up.
 */
function buildPauseDescriptions(intro) {
  const items = [{ label: "Weiterspielen:", text: " Die Story fortsetzen." }];

  if (!intro) {
    items.push({ label: "Pausieren:", text: " Später an dieser Stelle weitermachen." });
  }

  items.push({ label: "Abbrechen:", text: " Die Story ohne Speicherung abbrechen." });

  if (!intro) {
    items.push({ label: "Abschließen:", text: " Die Story hier beenden und als abgeschlossen werten." });
  }

  return items;
}

/**
 * Build the buttons for the pause pop-up.
 */
function buildPauseButtons(popUp, intro, { onLeaveNovel, onResume, onPause, onFinish }) {
  const buttons = [
    { 
      text: "WEITERSPIELEN", isPrimary: true, onClick: () => { 
        popUp.toggle(false);
        onResume();
      }
    }
  ];

  if (!intro) {
    buttons.push({
      text: "PAUSIEREN",
      isPrimary: false,
      onClick: () => onPause()
    });
  }

  buttons.push({ text: "ABBRECHEN", isPrimary: false, onClick: onLeaveNovel });

  if (!intro) {
    buttons.push({ text: "ABSCHLIEßEN", isPrimary: false, onClick: onFinish });
  }

  return buttons;
}

/**
 * Create the continue pop-up.
 */
export function createContinuePopUp(novel, { onContinue, onRestart }) {
  const popUp = PersonPopUp.create();

  popUp.config = {
    novelColor: novel["novelColor"],
    infoText:
      "Es gibt einen gespeicherten Spielstand. Möchtest du die Novel dort fortsetzen oder möchtest du die Novel neu starten? Wenn du neu startest, wird der pausierte Spielstand gelöscht und die Novel startet am Anfang.",
    buttons: [
      {
        text: "WEITERSPIELEN",
        isPrimary: true,
        className: CONTINUE_BUTTON_CLASS,
        onClick: () => {
          popUp.toggle(false);
          onContinue();
        },
      },
      {
        text: "NEU STARTEN",
        isPrimary: true,
        className: CONTINUE_BUTTON_CLASS,
        onClick: () => {
          popUp.toggle(false);
          onRestart();
        },
      },
    ],
    overlayClass: CONTINUE_OVERLAY_CLASS,
    modalWidth: "w-[82%]",
    btnContainerClass: "grid grid-cols-2 gap-[2.5cqw] mb-[15cqw]",
  };

  return popUp;
}

/**
 * Creates the undo choice pop-up.
 * @param {Object} novel - The novel object.
 * @param {Object} onResume - The callback function to resume the novel.
 * @param {Object} onUndo - The callback function to undo the choice.
 * @returns {Object} The undo choice pop-up.
 */
export function createUndoChoicePopUp(novel, { onResume, onUndo }) {
  const popUp = PersonPopUp.create();

  popUp.config = {
    novelColor: novel["novelColor"],
    title: "Bist du sicher, dass Du deine Entscheidung rückgängig machen möchtest?",
    buttons: [
      {
        text: "WEITERSPIELEN",
        isPrimary: true,
        onClick: () => {
          popUp.toggle(false);
          onResume();
        },
      },
      {
        text: "RÜCKGÄNGIG MACHEN",
        isPrimary: false,
        onClick: () => {
          popUp.toggle(false);
          onUndo();
        },
      },
    ],
    overlayClass: PAUSE_OVERLAY_CLASS,
    btnContainerClass: "flex flex-col gap-[2.5cqw] mt-[2cqw]",
  };

  return popUp;
}

// Schauen ob das novel im store mit der event id hinterlegt ist, falls ja wird es returnt
export function shouldShowContinuePopUp(novelName) {
  return novelStateStore.load(novelName) !== null;
}
