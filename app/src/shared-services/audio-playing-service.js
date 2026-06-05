import { loadAppSettings } from "./app-settings-session-service.js";
import { readJson } from "./store-service.js";

export function playAudio(audioFileName) {
  if(!audioFileName) {
    throw `Missing Parameter 'audioFileName'`
  }
  const settings = loadAppSettings();
 
  if(settings.soundsActive) {
    const sound = new Audio(`assets/AudioResources/${audioFileName}.wav`);
    sound.volume = settings.soundVolume / 100;
    sound.play();
    console.log("Playing Sound " + audioFileName);
  }
}

/**
 * Reads out a String if the voiceOutput Setting is active
 * @param {string} text
 */
export function TTSRead(text) {
  const settings = loadAppSettings();

  if(settings.voiceOutput) {
    const message = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(message);
    console.log("Reading out Message: " + text);
  }
}