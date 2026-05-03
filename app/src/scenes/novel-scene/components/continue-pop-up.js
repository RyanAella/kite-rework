class ContinuePopUp extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {

        if(this.novel['disablePauseMenu'] !== true) {
            console.log("Novel is not the intro novel")
            this.createContinueMenu();
            this.toggleContinueMenu(false);
            // For testing
            const debugHasSavedState = true;

            if (debugHasSavedState) {
                this.toggleContinueMenu(true);
            } else {
                this.novelScene.resolveCurrentEvent();
            }
        } else {
            this.novelScene.resolveCurrentEvent();
        }
    }

    createContinueMenu() {

    // Das Overlay (Alpha-Kanal, identisch zum Pause-Menü)
    this.continueOverlay = document.createElement('div');
    this.continueOverlay.className = "absolute inset-0 bg-black/50 z-[100] hidden transition-opacity duration-200";

    const modal = document.createElement('div');
    // Die exakte, ausfallsichere Zentrierung per Matrix-Transformation
    modal.className = "absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white rounded-[3cqw] p-[6cqw] w-[82%] flex flex-col gap-[4cqw] font-sans";
    modal.style.backgroundColor = this.novel['novelColor'];

    // Der Informationstext
    const infoText = document.createElement('p');
    infoText.className = "text-[3cqw] leading-relaxed mb-[8cqw]";
    infoText.innerText = "Es gibt einen gespeicherten Spielstand. Möchtest du die Novel dort fortsetzen oder möchtest du die Novel neu starten? Wenn du neu startest, wird der pausierte Spielstand gelöscht und die Novel startet am Anfang.";
    modal.appendChild(infoText);

    // Das Button-Grid
    const btnContainer = document.createElement('div');
    btnContainer.className = "grid grid-cols-2 gap-[2.5cqw] mb-[15cqw]";

    const createContinueBtn = (text, onClickAction) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = "py-[2.4cqw] px-[0.8cqw] rounded-[0.6cqw] font-bold text-[2.8cqw] text-center border-[0.3cqw] border-white bg-white";
        btn.style.color = this.novel['novelColor'];
        btn.addEventListener('click', onClickAction);
        return btn;
    };

    // Logik anbinden (Closures)
    btnContainer.appendChild(createContinueBtn("WEITERSPIELEN", () => {
        this.toggleContinueMenu(false);
        console.log("Mock-Storage: Lade gespeicherten Spielstand...");
        // Da der echte Storage noch fehlt, starten wir einfach den aktuellen Zeiger
        this.novelScene.resolveCurrentEvent();
    }));

    btnContainer.appendChild(createContinueBtn("NEU STARTEN", () => {
        this.toggleContinueMenu(false);
        console.log("Mock-Storage: Lösche Spielstand, Reset auf Index 0...");
        // Hard-Reset der Engine auf das erste Event der JSON
        this.novelScene.currentEvent = this.novel['novelEvents'][0];
        this.novelScene.resolveCurrentEvent();
    }));

    modal.appendChild(btnContainer);
    this.continueOverlay.appendChild(modal);
    this.appendChild(this.continueOverlay);
  }

  // Separater State-Toggler
  toggleContinueMenu(show) {
    if (show) {
      this.continueOverlay.classList.remove('hidden');
      this.continueOverlay.classList.add('block');
    } else {
      this.continueOverlay.classList.add('hidden');
      this.continueOverlay.classList.remove('block');
    }
  }
}

customElements.define("continue-pop-up", ContinuePopUp);