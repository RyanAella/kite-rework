# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.1] - 2026-09-22
### Changed

- **Hilfeplanung Character Adjustments**: Updated Tochter character (ID 13) appearance and positioning
  - Set fixed head to `Einstieg_Head_1.png` for Hilfeplanung novel in `path-finding-service.js`
  - Set eyebrow type to "Strong" for consistent facial expressions in `character-info-loader-service.js`
  - Adjusted vertical position from 85 to 60 for proper alignment with lamp in `character-info.json`

---

## [1.1.0] - 2026-09-18
### Added

- **Repository Integration**: Initial team-04 repository integration from GitLab with minor adjustments
- **Novel Import System**: Added novel import functionality and imported Hilfeplanung novel
- **Novel Importer feature**: Implemented a new system to import novel content dynamically
- **Project Structure**: Adapted project structure to support the new NovelImporter functionality
- **GitHub Pages Workflow**: Added `.github/workflows/pages.yml` for automated deployment
- **Documentation**: Added `docs/import-guide.md` with novel import instructions
- **Novel Data**: Added Hilfeplanung novel files in `app/assets/novels_twee/Hilfeplanung/`
  - `visual_novel_event_list.txt`
  - `visual_novel_meta_data.txt`
- **New Novel Assets**: Added Hilfeplanung character and background images
  - `app/assets/Images/Background/Hilfeplanung_BG.png`
  - `app/assets/Images/Character/ClothesImages/Hilfeplanung/Hilfeplanung_Clothes_1.png`
  - `app/assets/Images/Character/HairImages/Hilfeplanung/Hilfeplanung_Hair_1.png`
- **Python Import Script**: Added `import_novel.py` for dynamic novel import
- **Tests**: Added test files for core functionality
  - `app/tests/fetch-test.js`
  - `app/tests/image-loading-test.js`
  - `app/tests/store-test.js`

### Changed

- **Configuration**: Updated `.gitignore` and `package-lock.json`
- **JSON Data**: Updated novel and asset configuration files
  - `app/assets/json/character-info.json`
  - `app/assets/json/interactive-objects-info.json`
  - `app/assets/json/novels.json`
- **Scene Components**: Updated 11 scene and service files for novel import compatibility

### Removed

- **GitLab CI**: Removed `.gitlab-ci.yml` (replaced by GitHub Pages workflow)

### Fixed

- **Fixed GitHub Pages deployment issues**
  - Reorganized `EventAnimations` directories to remove umlauts and group shared assets:
    - `BüroAnmieten` → `Bank`
    - `InterviewAbklären` → images moved to `Presse`, `Bank`, `Honorar` (shared across novels)
    - `InvestorÜberzeugen` → `Investor`
    - `MitNotarinTelefonieren` → `Notarin`
    - `ElternInformieren` → `Eltern`
    - `HonorarVerhandeln` → `Honorar`
  - Regenerated `image-paths.json` (276 paths) to match current directory structure
  - Repaired corrupted `LeaveScene.wav` (44 bytes → valid 8864 bytes WAV file)
  - Fixed `DOMException` when loading audio files on GitHub Pages
  - Fixed image loading errors (`Logo_BGA.png`, `logo_hhn_lab.png`, `Linkedin-Triffuns.png`) with corrected paths

---

## [1.0.0] - 2024-06-24
### Added
- Initial release of KITE-Rework application

