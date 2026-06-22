import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

// Import the System Under Test (SUT)
import { ImageLoadingService } from "../src/shared-services/image-loading-service.js";

describe("Service Architecture: ImageLoadingService", () => {
  
  // Pointers to preserve the original Node.js environment state
  let originalFetch;
  let originalConsoleError;

  beforeEach(() => {
    // 1. ENVIRONMENTAL STATE PRESERVATION
    originalFetch = global.fetch;
    originalConsoleError = console.error;

    // Clear the static cache matrix before every test run to guarantee isolation
    ImageLoadingService.imageCache.clear();

    // 2. DOM API MOCKING (HTMLImageElement)
    // We construct an in-memory representation of the browser's native Image class.
    global.Image = class MockImage {
      constructor() {
        this._src = "";
        this.onerror = null;
      }

      set src(value) {
        this._src = value;
        // In a real browser, setting the src immediately dispatches network microtasks.
        // If the path contains the keyword "trigger_onerror", we simulate a 404 network drop.
        if (value.includes("trigger_onerror") && typeof this.onerror === "function") {
          // Push the error event to the end of the Node.js Event Loop via setImmediate
          // to accurately simulate asynchronous network latency.
          setImmediate(() => this.onerror(new Error("Simulated 404 Not Found")));
        }
      }

      get src() {
        return this._src;
      }

      // Simulate the asynchronous decoding pipeline of the rendering engine
      async decode() {
        if (this._src.includes("corrupted")) {
          throw new Error("Simulated Decoding Failure: Invalid JPEG headers");
        }
        return Promise.resolve();
      }
    };
  });

  afterEach(() => {
    // TEARDOWN: Prevent Memory Leaks & Global Pollution
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    delete global.Image;
  });

  it("should sequentially multiplex image decoding in batches and update the progress tracker", async () => {
    // Arrange: Construct an array of 30 mock paths to explicitly test the Batch Size (25) logic
    const virtualPaths = Array.from({ length: 30 }, (_, i) => `assets/img_${i}.png`);
    
    // Mock the Network I/O boundary
    global.fetch = async () => ({
      ok: true,
      json: async () => virtualPaths
    });

    // Our telemetry object passed by reference
    const progressTracker = { totalImageCount: 0, loadedCount: 0 };

    // Act
    await ImageLoadingService.loadImages(progressTracker);

    // Assert: Structural & State Verification
    assert.equal(
      progressTracker.totalImageCount, 
      30, 
      "Tracker must accurately reflect the total payload size."
    );
    assert.equal(
      progressTracker.loadedCount, 
      30, 
      "Tracker must reflect the completion of all batches (25 + 5)."
    );
    assert.equal(
      ImageLoadingService.imageCache.size, 
      30, 
      "The static Map must contain exactly 30 instantiated MockImage objects."
    );
  });

  it("must enforce the Fault-Tolerant Concurrency Model: Bad images should not halt the pipeline", async () => {
    // Arrange: Mix valid paths with structurally corrupted and unreachable network paths
    const mixedPaths = [
      "assets/valid_1.png",
      "assets/corrupted_image.jpg", // Will throw at img.decode()
      "assets/valid_2.png"
    ];

    global.fetch = async () => ({
      ok: true,
      json: async () => mixedPaths
    });

    const progressTracker = { totalImageCount: 0, loadedCount: 0 };

    // Act
    await ImageLoadingService.loadImages(progressTracker);

    // Assert: Evaluating the Graceful Degradation
    assert.equal(
      progressTracker.loadedCount, 
      3, 
      "The loop must iterate over all 3 items regardless of internal promise rejections."
    );
    
    assert.equal(
      ImageLoadingService.imageCache.size, 
      2, 
      "Only the 2 structurally sound images must be allocated to the static memory heap."
    );
    
    assert.ok(
      ImageLoadingService.imageCache.has("assets/valid_1.png"), 
      "Valid image 1 should be cached."
    );
    assert.equal(
      ImageLoadingService.imageCache.has("assets/corrupted_image.jpg"), 
      false, 
      "Corrupted images must be aggressively garbage collected, not cached."
    );
  });

  it("should cleanly catch structural validation errors (non-array payloads) from the JSON fetch", async () => {
    // Arrange: Simulate a malformed JSON file (e.g., an object instead of an array)
    global.fetch = async () => ({
      ok: true,
      json: async () => ({ data: "I am not an array" })
    });

    const progressTracker = { totalImageCount: 0, loadedCount: 0 };

    // Act
    await ImageLoadingService.loadImages(progressTracker);

    // Assert
    assert.equal(
      ImageLoadingService.imageCache.size, 
      0, 
      "Cache must remain empty on critical structural validation failure."
    );
  });

});