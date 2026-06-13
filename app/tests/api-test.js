import assert from "node:assert/strict";

/**
 * A dedicated test class for verifying the asynchronous REST interfaces.
 * Operates entirely without external dependencies utilizing the native Node.js Fetch API.
 */
class FeedbackApiIntegrationTest {
  
  constructor(port = 3000) {
    this.baseUrl = `http://localhost:${port}`;
  }

  /**
   * Executes the HTTP POST request and verifies the semantic 
   * and structural correctness of the server response.
   */
  async runFeedbackTest() {

    // A mock dialogue simulating the internal state of the visual novel
    const sampleDialogue = `
      Founder: "Good afternoon, I am highly interested in leasing these office spaces for my new startup."
      Landlord: "Glad to hear that. Do you already possess a solid business plan and the required financial collaterals?"
      Founder: "Not yet, but I do have a brilliant idea!"
    `;

    const payload = {
      dialogue: sampleDialogue
    };

    try {

      // 1. Dispatch the network request
      const response = await fetch(`${this.baseUrl}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 2. Verify the HTTP status code
      assert.equal(
        response.status, 
        200, 
        `Server responded with status code ${response.status} instead of 200.`
      );

      // 3. Deserialize the JSON payload
      const responseData = await response.json();

      // 4. Validate the data structure (Assertions)
      assert.ok(
        responseData.feedback, 
        "The JSON response is missing the required 'feedback' property."
      );

      // 5. Output the result buffer
      console.log("\n[AI FEEDBACK RESULT]:");
      console.log("--------------------------------------------------");
      console.log(responseData.feedback);
      console.log("--------------------------------------------------\n");

      console.log("[TEST SUCCESSFUL] All architectural assertions passed.");

    } catch (error) {
      // Differentiate between socket connection failures and assertion failures
      if (error.code === 'ECONNREFUSED') {
        console.error("[TEST FAILED] Connection refused. Please ensure the server.js instance is running.");
      } else {
        console.error("[TEST FAILED] Assertion or network exception:", error.message);
      }
      
      // Terminate the process with a non-zero exit code
      process.exit(1); 
    }
  }
}

// Instantiate and execute the integration test sequence
const tester = new FeedbackApiIntegrationTest(3000);
tester.runFeedbackTest();