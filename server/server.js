import http from "node:http";

const PORT = 3000;

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
    // TODO: AI API integration goes here
    sendJson(res, 200, {
      feedback: "Placeholder response – AI API not yet connected.",
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
