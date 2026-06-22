import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

// Import the System Under Test (SUT)
// Adjust this path to the actual name of your file!
import { 
  STORAGE_KEYS, 
  readJson, 
  writeJson, 
  remove, 
  novelStateStore, 
  bookmarkedNovelStore 
} from "../src/shared-services/store-service.js";

describe("Storage Layer Architecture: Local Storage Service", () => {

  // Pointer to preserve the global state
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;

    // DOM MOCKING: We inject an in-memory representation of the HTML5 Web Storage API
    // into the global Node.js heap to prevent physical I/O errors.
    global.localStorage = {
      _store: new Map(),
      getItem(key) {
        return this._store.has(key) ? this._store.get(key) : null;
      },
      setItem(key, value) {
        // The native localStorage enforces the serialization of all values to strings
        this._store.set(key, String(value));
      },
      removeItem(key) {
        this._store.delete(key);
      },
      clear() {
        this._store.clear();
      }
    };
  });

  afterEach(() => {
    // Teardown: Memory management (Garbage Collection)
    global.localStorage = originalLocalStorage;
  });

  describe("Low-Level JSON I/O Interfaces", () => {
    it("readJson(): should return the fallback object if the key does not exist", () => {
      const fallback = { status: "default" };
      const result = readJson("NON_EXISTENT_KEY", fallback);
      
      assert.deepEqual(result, fallback, "Must return the fallback if the pointer points to nothing.");
    });

    it("readJson() & writeJson(): should serialize and deserialize structurally complex graphs flawlessly", () => {
      const payload = { novelName: "example_novel", chapter: 4, isRead: true };
      
      writeJson("TEST_KEY", payload);
      const result = readJson("TEST_KEY", null);

      assert.deepEqual(result, payload, "Data integrity must be 100% preserved after the serialization cycle.");
    });

    it("readJson(): Graceful Degradation - should return the fallback if the JSON string is corrupted", () => {
      // We deliberately write corrupted JSON directly into the mock storage
      global.localStorage._store.set("CORRUPTED_KEY", "{ broken_json: true, ]");
      
      const fallback = [];
      const result = readJson("CORRUPTED_KEY", fallback);

      assert.deepEqual(result, fallback, "The try/catch block must catch the SyntaxError and trigger the fail-safe status (fallback).");
    });

    it("remove(): should completely delete the specified key from the heap", () => {
      writeJson("DELETE_ME", { data: 123 });
      remove("DELETE_ME");
      
      const result = readJson("DELETE_ME", "FALLBACK");
      assert.equal(result, "FALLBACK", "The memory area must be freed after calling the remove method.");
    });
  });

  describe("State Management: novelStateStore", () => {
    it("should manage the lifecycle of a paused novel state (Idempotent State Changes)", () => {
      const novelId = "FantasyQuest";
      
      // 1. Initial State (Empty)
      assert.equal(novelStateStore.load(novelId), null, "Uninitialized novels must return null.");

      // 2. State Mutation (Save)
      novelStateStore.save(novelId, "event_0042");
      assert.equal(novelStateStore.load(novelId), "event_0042", "The event pointer must be correctly allocated on the disk.");

      // 3. State Destruction (Clear)
      novelStateStore.clear(novelId);
      assert.equal(novelStateStore.load(novelId), null, "The state must be completely deleted after the clear call.");
    });
  });

  describe("Set Theory Logic: bookmarkedNovelStore", () => {
    it("load(): should filter corrupted storage entries and only return validated identifiers as a Set", () => {
      // Arrange: A mixed array with valid strings, invalid types (numbers), and unknown novels
      const corruptedStorageArray = ["ValidNovel1", "UnknownNovel", 123, null, "ValidNovel2"];
      writeJson(STORAGE_KEYS.bookmarkedNovels, corruptedStorageArray);

      // Define the Source of Truth for valid novels
      const validNames = ["ValidNovel1", "ValidNovel2", "ValidNovel3"];

      // Act
      const loadedSet = bookmarkedNovelStore.load(validNames);

      // Assert
      assert.ok(loadedSet instanceof Set, "The return value must strictly be a native Set data structure.");
      assert.equal(loadedSet.size, 2, "The filter algorithm must discard all invalid types and unknown names.");
      assert.ok(loadedSet.has("ValidNovel1") && loadedSet.has("ValidNovel2"), "Only the intersection may persist.");
    });

    it("toggle(): should deterministically switch between addition and subtraction of the element", () => {
      const myBookmarks = new Set(["NovelA"]);
      
      // 1. Toggle: Add
      bookmarkedNovelStore.toggle(myBookmarks, "NovelB");
      assert.ok(myBookmarks.has("NovelB"), "The toggle must mutate the set when the element is missing (add).");
      
      // Verify the persistence layer
      const persistedAfterAdd = readJson(STORAGE_KEYS.bookmarkedNovels, []);
      assert.deepEqual(persistedAfterAdd, ["NovelA", "NovelB"], "The set must be immediately serialized into an array and stored after mutation.");

      // 2. Toggle: Remove
      bookmarkedNovelStore.toggle(myBookmarks, "NovelA");
      assert.equal(myBookmarks.has("NovelA"), false, "The second toggle must delete the element (delete).");
    });
  });

});