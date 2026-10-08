// Managed by import_novel.py (--generate-image-paths). Do not edit by hand;
// run "python import_novel.py --generate-image-paths" to regenerate.
// Maps logical asset keys to their file paths under app/assets/Images.
export const UI_ASSETS = {
  "arrow.down": "assets/Images/DropDown/Arrow_Down.png",
  "arrow.left": "assets/Images/DropDown/Arrow_Left.png",
  "arrow.right": "assets/Images/DropDown/Arrow_Right.png",
  "button.archive": "assets/Images/Buttons/archive.png",
  "button.bookmark": "assets/Images/Buttons/bookmark.png",
  "button.burgerMenu": "assets/Images/Buttons/Burger_Menu_4x.png",
  "button.checkmark": "assets/Images/Buttons/Checkmark.png",
  "button.close": "assets/Images/Buttons/Close_2x.png",
  "button.copy": "assets/Images/Buttons/copy.png",
  "button.home": "assets/Images/Buttons/home.png",
  "button.info": "assets/Images/Buttons/Info_Circle.png",
  "button.knowledge": "assets/Images/Buttons/knowledge.png",
  "button.settings": "assets/Images/Buttons/settings.png",
  "button.weblinks": "assets/Images/Buttons/weblinks.png",
  "icon.dialogue": "assets/Images/IconsAndLogos/Icon_Dialogue.png",
  "icon.favorites": "assets/Images/IconsAndLogos/Icon_Favorites.png",
  "icon.gameArchive": "assets/Images/IconsAndLogos/Icon_GameArchive.png",
  "icon.knowledge": "assets/Images/IconsAndLogos/Icon_Knowledge.png",
  "icon.legal.big": "assets/Images/IconsAndLogos/Icon_Legal_Big.png",
  "icon.legal.small": "assets/Images/IconsAndLogos/Icon_Legal_Small.png",
  "icon.linklist": "assets/Images/IconsAndLogos/Icon_Linklist.png",
  "icon.load": "assets/Images/LoadingScreen/Icon_Load.png",
  "icon.settings": "assets/Images/IconsAndLogos/Icon_Settings.png",
  "icon.settings.active": "assets/Images/IconsAndLogos/Icon_Settings_Active.png",
  "icon.settings.inactive": "assets/Images/IconsAndLogos/Icon_Settings_Inactive.png",
  "icon.soundeffect": "assets/Images/IconsAndLogos/Icon_Soundeffect.png",
  "icon.typesize": "assets/Images/IconsAndLogos/Icon_Typesize.png",
  "logo.kite.circle": "assets/Images/LoadingScreen/Kite_Logo_im_Kreis.png",
  "logo.kite.white": "assets/Images/IconsAndLogos/Logo_Kite_Lettering_White.png",
  "logo.sponsor": "assets/Images/IconsAndLogos/Logo_Sponsor.png",
  "popup.person": "assets/Images/PopUp/Person_PopUp.png",
  "shape.novel": "assets/Images/FoundersBubble/Novel_Shape.png",
};

export function uiAsset(key) {
  const path = UI_ASSETS[key];
  if (!path) {
    console.error(`Unknown UI asset key: ${key}`);
    return "";
  }
  return path;
}
