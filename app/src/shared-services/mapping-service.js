// Loads and caches the shared mapping files (event types + face expressions)
// so that JS and the Python importer use the same source of truth.

export const EVENT_TYPES = {};

const expressionIdToName = {};

let mappingsPromise = null;

function parseExpressionMapping(text) {
    text.split("\n").filter(Boolean).forEach((line) => {
        const separatorIndex = line.lastIndexOf(":");
        const name = line.slice(0, separatorIndex);
        const id = line.slice(separatorIndex + 1).trim();
        expressionIdToName[id] = name;
    });
}

// Loads all mapping files once. Subsequent calls return the same promise.
export function loadMappings() {
    if (!mappingsPromise) {
        mappingsPromise = Promise.all([
            fetch("assets/mappings/event-types.json").then((response) => response.json()),
            fetch("assets/mappings/face-expressions.txt").then((response) => response.text()),
        ]).then(([eventTypes, expressionText]) => {
            Object.assign(EVENT_TYPES, eventTypes);
            parseExpressionMapping(expressionText);
        });
    }
    return mappingsPromise;
}

// Returns the expression name (e.g. "SmilingBig") for an expression id.
export function getExpressionName(id) {
    return expressionIdToName[id];
}

// Returns the face image folder name (e.g. "Smiling_Big") for an expression id.
export function getExpressionFolder(id) {
    return getExpressionName(id).replace(/([a-z])([A-Z])/g, "$1_$2");
}