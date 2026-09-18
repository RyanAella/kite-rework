/**
 * Global cache for novels.json to prevent repeated loading
 */
export const novelsCache = { data: null, promise: null };

/**
 * Fetches Data out of a json File
 * @param {String} path the Path to the json File as a String
 * @returns Contents of the json file as an Object
 */
export async function fetchFromJson(path) {
  // Special fast path for novels.json using global cache
  if (path === "assets/json/novels.json") {
    // Return cached data if available
    if (novelsCache.data) {
      return novelsCache.data;
    }
    // If a fetch is already in progress, wait for it
    if (novelsCache.promise) {
      return novelsCache.promise;
    }
    // Otherwise, fetch and cache
    novelsCache.promise = fetch(path)
      .then(response => response.json())
      .then(data => {
        novelsCache.data = data;
        novelsCache.promise = null;
        return data;
      })
      .catch(error => {
        novelsCache.promise = null;
        throw error;
      });
    return novelsCache.promise;
  }
  
  // Default path for other JSON files
  const response = await fetch(path);
  const data = await response.json();
  return data;
}