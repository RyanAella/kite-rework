/**
 * Fetches Data out of a json File
 * @param {String} path the Path to the json File as a String
 * @returns Contents of the json file as an Object
 */
export async function fetchFromJson(path) {
  const response = await fetch(path);
  const data = await response.json();
  return data;
}