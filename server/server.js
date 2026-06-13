import http from "node:http";

const PORT = 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("API Key was not found!");
}

/**   
  Sends a JSON response with the correct headers and status code.
  @param {http.ServerResponse} res - The response object.
  @param {number} statusCode - The status code of the response.
  @param {object} data - The data to send in the response.
**/
function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Access-Control-Allow-Origin": "*", // Allow all origins to access the resource. For GitLab Pages.
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allow the following methods to access the resource.
    "Access-Control-Allow-Headers": "Content-Type", // Allow the following headers to be sent with the request.
  });
  res.end(body);
}

/**
 * Communicates with the native Google Gemini REST API.
 * @param {string} dialogueText - The analyzed dialogue from the frontend.
 * @returns {Promise<string>} The AI generated feedback.
 */
async function generateGeminiFeedback(dialogueText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Payload for the Gemini API
  const payload = {
    contents: [{
      parts: [{
        // Prompt for Gemini
        text: `Du bist ein Experte für Kommunikation. Analysiere diesen Dialog und gib professionelles Feedback:\n\n${dialogueText}`
      }]
    }],
    generationConfig: {
      temperature: 0.7, // (0.0 = deterministic, 1.0 = highly creative)
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  
  return data.candidates[0].content.parts[0].text;
}

/**
  Handles incoming requests and routes them to the correct handler.
  @param {http.IncomingMessage} req - The request object.
  @param {http.ServerResponse} res - The response object.
**/
function handleRequest(req, res) {

  const method = req.method;
  const url = req.url;       

  // Handling CORS preflight requests.
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // Checking if the server is online.
  if (method === "GET" && url === "/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  // Handling the accutal AI API request.
  if (method === "POST" && url === "/feedback") {
    console.log("Entered if clause...")
    let rawData = "";

    // Convert input stream into object
    req.on("data", (chunk) => {
      rawData += chunk.toString();
    });

    // Continue after all packets arrived
    req.on("end", async () => {
      try {
        if (!GEMINI_API_KEY) throw new Error("API-Key not configured.");

        const parsedBody = JSON.parse(rawData);
        
        // Access dialogue attribute from JSON object
        const dialogueText = parsedBody.dialogue; 

        if (!dialogueText) {
          sendJson(res, 400, { error: "Missing 'dialogue' in request body" });
          return;
        }

        console.log("Text:" + dialogueText);

        const aiFeedback = await generateGeminiFeedback(dialogueText);

        console.log("AI Feedback: " + aiFeedback);

        // Send feedback back to Frontend
        sendJson(res, 200, { feedback: aiFeedback });

      } catch (error) {
        sendJson(res, 500, { error: "Internal server error at feedback generation." });
      }
    });

    return; 
  }

  sendJson(res, 404, { error: "Not found" });
}

// Create the server and listen for requests.
const server = http.createServer((req, res) => {
  try {
    handleRequest(req, res);
  } catch (error) {
    console.error("Unhandled request error:", error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`AI Feedback server listening on http://localhost:${PORT}`);
});
