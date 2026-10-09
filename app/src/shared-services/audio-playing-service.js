import { loadAppSettings } from "./app-settings-session-service.js";
import { readJson } from "./store-service.js";

/**
 * Plays a wav file
 * @param {String} audioFileName The Path to the Audio File
 */
export function playAudio(audioFileName) {
  if(!audioFileName) {
    throw `Missing Parameter 'audioFileName'`
  }
  const sound = createAudio(audioFileName);
  if(sound) {
    sound.play();
  }
}

/**
 * Plays a wav file in a loop until stopped
 * @param {String} audioFileName The Path to the Audio File
 * @returns {HTMLAudioElement | null} The playing sound, or null if sounds are disabled
 */
export function playAudioLoop(audioFileName) {
  if(!audioFileName) {
    throw `Missing Parameter 'audioFileName'`
  }
  const sound = createAudio(audioFileName);
  if(sound) {
    sound.loop = true;
    sound.play();
  }
  return sound;
}

/**
 * Stops a looping sound started with playAudioLoop
 * @param {HTMLAudioElement | null} sound
 */
export function stopAudioLoop(sound) {
  if(sound) {
    sound.pause();
    sound.currentTime = 0;
  }
}

/**
 * Creates an Audio element respecting the sound settings
 * @param {String} audioFileName The Path to the Audio File
 * @returns {HTMLAudioElement | null}
 */
function createAudio(audioFileName) {
  const settings = loadAppSettings();
  if(settings.soundsActive) {
    const sound = new Audio(`assets/AudioResources/${audioFileName}.wav`);
    sound.volume = settings.soundVolume / 100;
    return sound;
  }
  return null;
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
  }
}