class PausePopUp extends HTMLElement {
  
    constructor() {
        super();
    } 

    connectedCallback() {
        if (this.novel) {
            this.createPauseMenu();
            this.togglePauseMenu(false);
        } else {
            console.error("PausePopUp: novel Objekt wurde nicht übergeben!");
        }
    }

    createPauseMenu() {
        // Das Haupt-Overlay (verdunkelt den Hintergrund und fängt Klicks ab)
        this.pauseOverlay = document.createElement('div');
        this.pauseOverlay.className = "absolute inset-0 bg-black/50 z-[100] hidden p-[4cqw] transition-opacity duration-300";

        const modal = document.createElement('div');
        modal.className = "absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white rounded-[3cqw] p-[6cqw] w-[80%] flex flex-col gap-[4cqw] font-sans";
        modal.style.backgroundColor = this.novel['novelColor'];

        // Titel
        const title = document.createElement('h2');
        title.innerText = "Was möchtest du tun?";
        title.className = "text-[3cqw] mb-[5cqw]";
        modal.appendChild(title);

        // Prüfen, ob es sich um die Einstiegsnovel handelt
        const isIntro = this.novel['disablePauseMenu'] === true;

        // 2. Die Beschreibungen bedingt aufbauen
        const descriptions = [
            { label: "Weiterspielen:", text: " Die Story fortsetzen." }
        ];
        
        // Pausieren nur hinzufügen, wenn es NICHT das Intro ist
        if (!isIntro) {
            descriptions.push({ label: "Pausieren:", text: " Später an dieser Stelle weitermachen." });
        }

        descriptions.push({ label: "Abbrechen:", text: " Die Story ohne Speicherung abbrechen." });

        // Abschließen nur hinzufügen, wenn es NICHT das Intro ist
        if (!isIntro) {
            descriptions.push({ label: "Abschließen:", text: " Die Story hier beenden und als abgeschlossen werten." });
        }

        const descContainer = document.createElement('div');
        descContainer.className = "flex flex-col gap-[1.5cqw] text-[3cqw] leading-snug";
        descriptions.forEach(desc => {
            const p = document.createElement('p');
            p.className = "my-0";
            p.innerHTML = `<span class="font-bold">${desc.label}</span>${desc.text}`;
            descContainer.appendChild(p);
        });
        modal.appendChild(descContainer);

        // Das 2x2 Button-Grid
        const btnContainer = document.createElement('div');
        btnContainer.className = "grid grid-cols-2 gap-[2.5cqw] mt-[2cqw]";

        // Hilfsfunktion zur Generierung der Buttons (verhindert Code-Duplikation)
        const createBtn = (text, isPrimary, onClickAction) => {
            const btn = document.createElement('button');
            btn.innerText = text;
            // isPrimary steuert das Design (Weißer Hintergrund vs. Transparenter Hintergrund mit Rand)
            if (isPrimary) {
                // Weißer Button mit farbigem Text
                btn.className = "py-[1.6cqw] px-[0.8cqw] rounded-[0.6cqw] font-bold text-[2.6cqw] text-center border-[0.3cqw] border-white bg-white";
                btn.style.color = this.novel['novelColor'];
            } else {
                // Transparenter Button mit weißem Rand und Text
                btn.className = "py-[1.6cqw] px-[0.8cqw] rounded-[0.6cqw] font-bold text-[2.6cqw] text-center border-[0.3cqw] text-white border-white bg-transparent";
            }
            btn.addEventListener('click', onClickAction);
            return btn;
        };

        // 4. Die Buttons bedingt rendern
        btnContainer.appendChild(createBtn("WEITERSPIELEN", true, () => this.togglePauseMenu(false)));

        if (!isIntro) {
            btnContainer.appendChild(createBtn("PAUSIEREN", false, () => console.log("Logik für Pausieren")));
        }
        
        btnContainer.appendChild(createBtn("ABBRECHEN", false, () => 
        this.dispatchEvent(new CustomEvent("sm-switch-scene", {
            detail: { scene : "novel-selector" },
            bubbles : true}))));
            
        if (!isIntro) {
            btnContainer.appendChild(createBtn("ABSCHLIEßEN", false, () => 
            this.dispatchEvent(new CustomEvent("sm-switch-scene", {
                detail: { scene : "novel-selector" },
                bubbles : true}))));
        }

        modal.appendChild(btnContainer);
        this.pauseOverlay.appendChild(modal);

        // Das Overlay als letztes Element in die Web Component einhängen
        this.appendChild(this.pauseOverlay);
    }

    togglePauseMenu(show) {
        if (show) {
            // Menü anzeigen
            this.pauseOverlay.classList.remove('hidden');
            this.pauseOverlay.classList.add('block');
        } else {
            // Menü verstecken
            this.pauseOverlay.classList.add('hidden');
            this.pauseOverlay.classList.remove('block');
        }
    }

}

customElements.define("pause-pop-up", PausePopUp);