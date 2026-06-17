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
    "Access-Control-Allow-Origin": "https://team-04-d7efe7.pages.it.hs-heilbronn.de", // Allow origin to send resources
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
        text: `Du bist eine Geschlechterforscherin. 

              Deine Aufgabe ist es, den folgenden Dialog auf Diskriminierung hin zu untersuchen. 

              ${dialogueText}

              Schreibe einen Analysetext. Stelle die Biases und Verzerrungen dar, auf die du dich beziehst (unten eine Liste mit Geschlechterbiases im Gründungsprozess). 

              Im Dialog findest Du auch Hinweise auf Biases, die an der jeweiligen Stelle des Dialogs zum Tragen kommen. Nutze diese Hinweise zur Analyse des Dialogs. 

              Analysiere auch das Verhalten der Spielerin und ihre Reaktionen auf diese Biases. Erläutere die jeweiligen Biases mit konkreten Beispielen aus dem Dialog. 

              Stelle die Vorteile des Verhaltens der Spielerin dar und deute vorsichtig an, welche Nachteile ihre Reaktion haben könnte.

              Führe das Nicht-Ansprechen geschlechterstereotyper Annahmen nicht bei den Nachteilen auf.

              Sei vorsichtig mit dem Hinweis, Biases und Stereotype direkt anzusprechen, weil dies zwar generell sinnvoll sein kann, die Spielerin aber in erster Linie darauf achten muss, dass sie das Gespräch so führt, dass sie im Gespräch erfolgreich ist.

              Nutze geschlechtergerechte Sprache (z.B. Gründer*innen, weibliche Gründerinnen).

              Richte den Text in der Du-Form an die Spielerin. Sei wohlwollend und ermunternd. Sprich die Spielerin nicht mit ihrem Namen an. Formuliere den Text aus einer unbestimmten Ich-Perspektive. 

              Bitte sende kein markdown Format zurück, und markiere keinen Text oder Überschrift als fett und übergebe einen normalen Fließtext mit Abschnitten falls sinnvoll.`
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
      "Access-Control-Allow-Origin": "https://team-04-d7efe7.pages.it.hs-heilbronn.de",
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
