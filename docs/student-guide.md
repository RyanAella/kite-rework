# Studenten-Guide: Dein eigenes Novel erstellen

Diese Anleitung richtet sich an Autorinnen und Autoren, die **kein JavaScript
können und auch keins schreiben müssen**. Du schreibst deinen Dialog als
einfache Textdatei, legst deine Bilder in die richtigen Ordner und führst am
Ende einen einzigen Befehl aus — fertig ist deine Novel in der App.

Alle technischen Details findest du zusätzlich im [Import-Guide](import-guide.md).

---

## Was du brauchst

- Das Projekt (als ZIP oder geklont) auf deinem Rechner
- **Python 3** (windows: python.org, Mac: meist vorinstalliert, `python3 --version` testen)
- Einen Texteditor (z. B. VS Code)
- Bilder für deine Charaktere und den Hintergrund (PNG)

---

## Der Ablauf in 5 Schritten

```
Schritt 1: Novel-Ordner anlegen
Schritt 2: Twee-Dateien schreiben (Metadaten + Dialog)
Schritt 3: Bilder ablegen
Schritt 4: Bilder + Charaktere registrieren (2 JSON-Dateien)
Schritt 5: python import_novel.py ... --append  → App öffnen → testen
```

---

## Schritt 1: Novel-Ordner anlegen

Erstelle irgendwo auf deinem Rechner einen Ordner für deine Novel, z. B.
`meine_novel/`. Dort hinein kommen später genau zwei Textdateien.

## Schritt 2: Twee-Dateien schreiben

### 2a: `visual_novel_meta_data.txt`

Infos über deine Novel als JSON (Titel, Beschreibung, Farben, Startpassage und
wer mitspielt):

```json
{
  "folderName": "MeineNovel",
  "titleOfNovel": "Meine erste Novel",
  "descriptionOfNovel": "Eine kurze Beschreibung, die in der Auswahl erscheint.",
  "novelColor": "#25650e",
  "novelFrameColor": "#4c9a30",
  "start": "Anfang",
  "talkingPartner01": "Tochter"
}
```

- `start` muss exakt dem Namen deiner ersten Passage im Dialog entsprechen.
- `talkingPartner01` ist der Name deines Gesprächspartners (Charaktername).

### 2b: `visual_novel_event_list.txt` — dein Dialog

Das ist Twee-Format: ein `::` beginnt eine Passage, `[[Text->Ziel]]` ist eine
klickbare Wahl, mit `>>End<<` endet die Novel.

```
:: Anfang
>>Tochter|Neutral<<
Ist das deine erste Hilfeplanung?

:: Ja [->ErsteHilfeplanung]
Ja, das ist meine erste Hilfeplanung.

:: Nein [->NichtErste]
Nein, ich hatte schon mal eine Hilfeplanung.

:: ErsteHilfeplanung
Dann erklären wir alles Schritt für Schritt.
>>End<<

:: NichtErste
Dann wissen Sie ja schon Bescheid.
>>End<<
```

**Wichtigste Regeln:**

| Element | So schreibst du es | Bedeutung |
|---|---|---|
| Passage | `:: Name` | Ein Abschnitt des Dialogs (Name ohne Leerzeichen empfohlen) |
| Text | Einfache Zeile unter der Passage | Das, was gesagt/angezeigt wird |
| Wahl | `[[Text->Ziel]]` | Klickbare Option; `Ziel` = Name der nächsten Passage |
| Sprecher/Mimik | `>>Name\|Ausdruck<<` | Wer gerade spricht und mit welchem Gesicht (`Fine_Neutral`, `Strong_Happy`, … siehe `app/assets/mappings/face-expressions.txt`) |
| Zeilenumbruch | `--` | Erzwungener Umbruch im Text |
| Ende | `>>End<<` | Beendet die Novel und führt zum Abschluss/KI-Feedback |

**Tipp:** Plane erst auf Papier, welche Passagen es gibt und wohin die Wahlen
führen, bevor du schreibst. Jede Wahl muss auf eine Passage zeigen, die
wirklich existiert — sonst läuft der Spieler ins Leere.

## Schritt 3: Bilder ablegen

Bilder gehören nach `app/assets/Images/`, und zwar in festgelegte Unterordner
mit festgelegten Namen:

| Typ | Ordner | Dateiname |
|---|---|---|
| Haare | `Character/HairImages/<Ordner>/` | `MeineNovel_Hair_1.png` |
| Kleidung | `Character/ClothesImages/<Ordner>/` | `MeineNovel_Clothes_1.png` |
| Hände | `Character/HandsImages/<Ordner>/` | `MeineNovel_Hands_a.png` |
| Hintergrund | `Background/` | `MeineNovel_BG.png` |
| Gesichter/Augen/etc. | `FaceImages/`, `EyesImages/`, … | bestehen i. d. R. schon für vorhandene Charaktere |

Regeln:

- **Stets bei `_1` beginnen**, niemals `_0.png`
- **Groß-/Kleinschreibung zählt**
- Der Ordnername muss später exakt dem `folderName` aus den Metadaten entsprechen

Existiert dein Charakter bereits (weil ein anderer ihn schon benutzt), kannst
du diesen Schritt komplett überspringen.

## Schritt 4: Registrieren (die zwei JSON-Dateien)

Zwei Dateien in `app/assets/json/` müssen deine neuen Dinge kennen:

1. **`character-info.json`** — Charakter eintragen (nur falls er neu ist):

   ```json
   {
     "id": 21,
     "name": "MeineFigur",
     "folderName": "MeineNovel",
     "positionX": 0,
     "positionY": 75,
     "glasses": false,
     "headset": false,
     "hasHands": false,
     "maxHair": 1,
     "maxClothes": 1
   }
   ```

   - `id` muss einzigartig sein (höchste bisherige ID + 1)
   - `folderName` = dein Bildordner-Name
   - `maxHair`/`maxClothes` = Anzahl deiner Hair-/Clothes-Bilder (mind. 1)

2. **`image-paths.json`** — alle neuen Bildpfade als Array-Einträge ergänzen:

   ```json
   "assets/Images/Character/HairImages/MeineNovel/MeineNovel_Hair_1.png"
   ```

   Der Pfad ist relativ zu `app/assets/` und muss stimmen — sonst wird das
   Bild nicht vorab geladen (404 in der Konsole).

## Schritt 5: Import ausführen und testen

```bash
cd /Pfad/zu/kite-rework

# Neue Novel HINZUFÜGEN (wichtig: --append nicht vergessen!)
python import_novel.py ./meine_novel --append

# Oder: eine bestehende Novel aktualisieren (gleicher Name ersetzt sie)
python import_novel.py ./meine_novel
```

Erfolgreich sieht so aus:

```
Novel 'MeineNovel' nach app/assets/json/novels.json exportiert
  - 42 Events generiert
```

Danach:

1. Server starten (VS Code → „Go Live" / Live Server) und `app/index.html` öffnen
2. Browser-Cache leeren (`Ctrl + Shift + R`)
3. Deine Novel in der App auswählen und durchspielen
4. Bei Fehlern: `F12` → Console öffnen und die Meldung lesen

---

## Häufige Probleme

| Problem | Ursache | Lösung |
|---|---|---|
| Novel erscheint nicht in der App | `--append` vergessen oder Import fehlergeschlagen | Befehl mit `--append` erneut ausführen, Konsolenausgabe lesen |
| 404 für Bild (`…_0.png`) | `maxHair`/`maxClothes` = 0 oder Bild fehlt | Wert auf mind. 1 setzen bzw. Bild ergänzen |
| Bild wird schwarz/nicht angezeigt | Pfad fehlt in `image-paths.json` oder Schreibweise weicht ab | Pfad exakt so eintragen, wie die Datei heißt |
| Wahl klickt ins Leere | Ziel-Passage existiert nicht | Passage anlegen oder Ziel korrigieren |
| App startet gar nicht | Novel-Daten kaputt (JSON-Fehler) | JSON mit einem Validator prüfen (Kommas!) |
| `python` unbekannt | Python nicht installiert oder heißt `python3` | Python 3 installieren bzw. `python3 import_novel.py …` |

---

## Checkliste vor dem Abgeben

- [ ] `visual_novel_meta_data.txt` ist gültiges JSON
- [ ] `start` verweist auf eine existierende Passage
- [ ] Jede Wahl (`[[…]]`) verweist auf eine existierende Passage
- [ ] Mindestens ein `>>End<<` existiert
- [ ] Alle Bilder vorhanden und korrekt benannt (ab `_1`)
- [ ] Charakter in `character-info.json` eingetragen (falls neu)
- [ ] Bildpfade in `image-paths.json` eingetragen
- [ ] Import lief ohne Fehler durch
- [ ] Novel einmal komplett durchgespielt

Noch offene Ideen, wie dieser Prozess für Studenten einfacher werden kann
(z. B. automatische Bildpfad-Generierung), sind in der Projektdoku notiert.
