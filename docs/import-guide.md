# Import-Anleitung: Bilder und Charaktere für neue Novels

---

## Inhaltsverzeichnis
1. [Vorraussetzungen](#1-vorraussetzungen)
2. [Dateistruktur vorbereiten](#2-dateistruktur-vorbereiten)
3. [Bilder ablegen](#3-bilder-ablegen)
4. [Bilder registrieren (Preloading)](#4-bilder-registrieren-preloading)
5. [Charakter anpassen](#5-charakter-anpassen)
6. [Novel-Daten vorbereiten](#6-novel-daten-vorbereiten)
7. [Import ausführen](#7-import-ausführen)
8. [Import abschließen](#8-import-abschließen)
9. [Quick-Check für häufige Fehler](#9-quick-check-für-häufige-fehler)
10. [Zusammenfassung: Was wo hingehört](#10-zusammenfassung-was-wo-hingehört)

---

---

## 1. Vorraussetzungen

- **Python 3.x** muss installiert sein
- **Skript:** `import_novel.py` (liegt im Projekt-Root `/kite-rework/`)

---

---

## 2. Dateistruktur vorbereiten

Relevante Dateien und Ordner:
```
kite-rework/
├── import_novel.py                # Import-Skript (Python)
├── docs/                         # Diese Anleitung
└── app/
    ├── assets/
    │   ├── json/
    │   │   ├── character-info.json   # Manuell anpassen
    │   │   └── image-paths.json      # Manuell anpassen
    │   └── Images/Character/         # Bilder hier ablegen
    └── assets/json/novels.json    # Wird automatisch generiert
```

---

---

## 3. Bilder ablegen

**Pfad:** `/app/assets/Images/Character/`

### Ordnerstruktur und Dateiformate

| Typ | Unterordner | Dateinamen-Format | Beispiel |
|-----|-------------|-------------------|----------|
| **Haare** | `HairImages/[Charakterordner]/` | `[Charakter]_Hair_[1-4].png` | `Einstieg_Hair_1.png` |
| **Kleidung** | `ClothesImages/[Charakterordner]/` | `[Charakter]_Clothes_[1-4].png` | `Einstieg_Clothes_1.png` |
| **Gesichter** | `FaceImages/[Ausdruck]/` | `[Fine/Strong]_[Ausdruck][_Speaking].png` | `Fine_Neutral.png` |
| **Hände** | `HandsImages/[Charakterordner]/` | `[Charakter]_Hands_[a-d].png` | `Bank_Hands_a.png` |
| **Köpfe** | `HeadImages/` | `Head_[1-2]_[a-d].png` oder `[Charakter]_Head_1.png` | `Einstieg_Head_1.png` |
| **Augen** | `EyesImages/` | `Eyes_[Closed/Half_Open/Open].png` | `Eyes_Open.png` |
| **Brillen** | `GlassesImages/` | `Glasses.png` | – |
| **Kopfhörer** | `ClothesImages/[Charakterordner]/` | `[Charakter]_Headset.png` | `Notarin_Headset.png` |

### Wichtige Regeln
- **Keine `_0.png`** – immer bei `_1.png` anfangen!
- **Groß-/Kleinschreibung beachten**
- **Alle Bilder müssen im Dateisystem existieren**

---

---

## 4. Bilder registrieren (für Preloading)

**Datei:** `/app/assets/json/image-paths.json`

- **Format:** JSON-Array mit allen Bildpfaden (relativ zu `/app/assets/`)
- **Jedes Bild muss genau einmal eingetragen sein**

### Beispiel
```json
[
  "assets/Images/Character/HairImages/Einstieg/Einstieg_Hair_1.png",
  "assets/Images/Character/ClothesImages/Einstieg/Einstieg_Clothes_1.png"
]
```

---

---

## 5. Charakter anpassen

**Datei:** `/app/assets/json/character-info.json`

### Beispiel-Eintrag
```json
{
  "characters": [
    {
      "id": 20,
      "name": "Test",
      "folderName": "Test",
      "positionX": 0,
      "positionY": 75,
      "glasses": false,
      "headset": false,
      "hasHands": false,
      "maxHair": 1,
      "maxClothes": 1
    }
  ]
}
```

### Wichtig
- **`folderName`** muss mit dem Ordnernamen in `HairImages/` und `ClothesImages/` übereinstimmen
- **`maxHair` und `maxClothes` müssen ≥ 1 sein** (sonst `_0.png`-Fehler)
- **`id` muss einzigartig sein**

---

---

## 6. Novel-Daten vorbereiten

Die Novel-Daten werden **automatisch** aus **Twee-Format** importiert (nicht manuell in `novels.json` eintragen).

### Benötigte Input-Dateien
Erstelle ein Verzeichnis mit:
```
Quellverzeichnis/
├── visual_novel_meta_data.txt    # Metadaten (JSON)
└── visual_novel_event_list.txt   # Dialoge (Twee-Format)
```

### Format: `visual_novel_meta_data.txt`
```json
{
  "folderName": "Hilfeplanung",
  "titleOfNovel": "Hilfeplanung mit Tochter",
  "descriptionOfNovel": "Beschreibung...",
  "novelColor": "#25650e",
  "novelFrameColor": "#4c9a30",
  "start": "Anfang",
  "talkingPartner01": "Tochter"
}
```

### Format: `visual_novel_event_list.txt` (Twee)
```
:: Anfang
Ist das deine erste Hilfeplanung?

:: Ja [->ErsteHilfeplanung]
Ja, das ist meine erste Hilfeplanung.

:: Nein [->NichtErste]
Nein, ich hatte schon mal eine Hilfeplanung.

:: ErsteHilfeplanung
Dann erklären wir alles Schritt für Schritt.

:: NichtErste
Dann wissen Sie ja schon Bescheid.
```

### Twee-Syntax-Referenz
| Element | Syntax | Beispiel |
|---------|--------|----------|
| **Passage** | `:: Name` | `:: Anfang` |
| **Link/Option** | `[[Text->Ziel]]` | `[[Ja->Weiter]]` |
| **Link mit Text** | `[[Text|Ziel]]` | `[[Ja|Weiter]]` |
| **Charakter-Makro** | `>>CharName|Expression<<` | `>>Character1|Neutral<<` |
| **Zeilenumbruch** | `--` | `--` |
| **Ende** | `>>End<<` | `>>End<<` |

---

---

## 7. Import ausführen

### Befehl
```bash
# Im Projekt-Root ausführen:
cd /Pfad/zu/kite-rework
python import_novel.py /Pfad/zum/Quellverzeichnis [--append]
```

### Optionen
| Option | Beschreibung |
|--------|--------------|
| `--append` / `-a` | Fügt zur bestehenden `novels.json` hinzu (Standard: überschreibt bestehende Novel mit gleichem Namen) |

### Beispiele
```bash
# Im Projekt-Root (kite-rework/) ausführen:
cd C:/Users/rebec/WorkProjects/LabSW/kite-rework

# Beispiel 1: Neue Novel zur BESTEHENDEN novels.json hinzufügen
python import_novel.py ./neue_novel_daten --append

# Beispiel 2: Bestehende Novel überschreiben (z. B. Hilfeplanung aktualisieren)
python import_novel.py ./hilfeplanung_daten
```

### Ausgabe
Das Skript gibt aus:
```
Novel 'NeueNovel' nach app/assets/json/novels.json exportiert
  - 42 Events generiert
```

### Praktisches Beispiel mit bestehender novels.json
Angenommen, deine bestehende `novels.json` enthält bereits die Novels "Einstieg" und "Hilfeplanung".
Um eine **neue Novel "Test"** hinzuzufügen:

1. Erstelle ein Verzeichnis `test_daten/` mit:
   ```
   test_daten/
   ├── visual_novel_meta_data.txt
   └── visual_novel_event_list.txt
   ```

2. Führe im Projekt-Root aus:
   ```bash
   python import_novel.py test_daten --append
   ```

3. Das Skript:
   - Liest die Twee-Dateien
   - Konvertiert sie in KITE-Events
   - **Fügt** die neue Novel zur bestehenden `novels.json` hinzu
   - Erhält alle bestehenden Novels (Einstieg, Hilfeplanung) und fügt "Test" hinzu

> **Wichtig:** Ohne `--append` würde die bestehende `novels.json` **überschrieben** werden!

---

---

## 8. Import abschließen

### Prüfliste
- [ ] Alle Bilder existieren und sind in `image-paths.json` eingetragen
- [ ] Charakter-Einträge in `character-info.json` sind korrekt
- [ ] Python-Skript wurde ohne Fehler ausgeführt
- [ ] `novels.json` wurde generiert/aktualisiert

### Testen
1. **Server starten** (z. B. Live Server in VS Code)
2. **Browser-Cache leeren** (`Ctrl + Shift + R`)
3. **Novel in der App auswählen und durchspielen**
4. **Konsolen-Logs prüfen** (`F12` → Console) auf Fehler

---

---

## 9. Quick-Check für häufige Fehler

| Fehler | Ursache | Lösung |
|--------|---------|--------|
| **404 für `_0.png`** | `maxHair`/`maxClothes` = 0 | `character-info.json` prüfen, `+1` in Code (Zeile 54-55) |
| **404 für Bild** | Pfad in `image-paths.json` falsch | Pfad korrigieren |
| **Import fehlt** | Python nicht installiert | Python 3.x installieren |
| **Skript nicht gefunden** | Falsches Arbeitsverzeichnis | `cd` in Projekt-Root |
| **Twee-Syntaxfehler** | Falsches Format | Syntax in Event-Datei prüfen |

---

---

## 10. Zusammenfassung: Was wo hingehört

| Was | Pfad | Manuell? |
|-----|------|----------|
| **Python-Skript** | `/import_novel.py` | ❌ (vorhanden) |
| **Quelldaten (Twee)** | Quellverzeichnis | ✅ |
| **Bilder** | `/app/assets/Images/Character/...` | ✅ |
| **Bildpfade** | `/app/assets/json/image-paths.json` | ✅ |
| **Charaktere** | `/app/assets/json/character-info.json` | ✅ |
| **novels.json** | `/app/assets/json/novels.json` | ❌ (automatisch via Python) |

---

**✅ Fertig!** Der Import ist abgeschlossen, sobald das Python-Skript erfolgreich durchgelaufen ist und alle manuellen Anpassungen (Bilder, image-paths.json, character-info.json) durchgeführt wurden.
