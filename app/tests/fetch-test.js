import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { pathToFileURL } from "node:url";
import { createReadStream } from "node:fs";

// Import the System Under Test (SUT)
import { fetchFromJson } from "../src/shared-services/fetch-service.js"; 

describe("Network Service Integration Architecture: fetchFromJson()", () => {
  
  // 1. Define the physical constraints of our hardcoded test file
  const TEST_FILE_NAME = "testfile.json";
  const TEST_FILE_PATH = path.resolve(process.cwd(), TEST_FILE_NAME);

  // Variables to hold our ephemeral server and its dynamic URL
  let testServer;
  let testServerUrl;
  
  // Convert the physical OS path (C:\... or /Users/...) into a compliant file:// URL
  // This is architecturally required because Node's native fetch rejects relative paths.
  const TEST_FILE_URL = pathToFileURL(TEST_FILE_PATH).href;

  // The hardcoded JSON graph we expect to write and read
  const hardcodedData = {
    testType: "Hardware Integration",
    latency: "Low",
    diskReadSuccessful: true
  };

  // 2. SETUP PHASE (Bootstrapping the Environment)
  // Before any test runs, we write the actual bits to the physical SSD/HDD.
  before(async () => {
    await fs.writeFile(
      TEST_FILE_PATH, 
      JSON.stringify(hardcodedData, null, 2), 
      "utf-8"
    );

    // Step B: Spawn an ephemeral Node.js HTTP server to serve the physical file
    // This provides the fetch API with the TCP socket it strictly requires.
    return new Promise((resolve) => {
      testServer = http.createServer((req, res) => {
        // Stream the physical file from the hard drive into the network socket
        res.writeHead(200, { "Content-Type": "application/json" });
        const fileStream = createReadStream(TEST_FILE_PATH);
        fileStream.pipe(res);
      });

      // Listen on port 0. The OS will automatically assign a random, available TCP port.
      testServer.listen(0, '127.0.0.1', () => {
        const port = testServer.address().port;
        testServerUrl = `http://127.0.0.1:${port}/`;
        resolve();
      });
    });
  });

  // 3. TEARDOWN PHASE (Garbage Collection & Cleanup)
  // Regardless of whether the test passes or fails, we must wipe the file 
  // from the OS to maintain a stateless testing environment.
  after(async () => {
    // Step A: Close the TCP socket and free the port in the OS
    if (testServer) {
      await new Promise((resolve) => testServer.close(resolve));
    }

    try {
      await fs.unlink(TEST_FILE_PATH);
    } catch (error) {
      console.error("Cleanup Warning: Could not delete integration test file.", error);
    }
  });

  it("should successfully perform physical I/O and parse a hardcoded JSON file via file:// protocol", async () => {
    const data = await fetchFromJson(testServerUrl);

    // Assert: Verify the deserialized object strictly matches the bits on the disk
    assert.deepEqual(
      data, 
      hardcodedData, 
      "The returned object must strictly match the contents of the physical JSON file on the disk."
    );
  });

});