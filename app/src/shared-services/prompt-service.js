// Builds the AI feedback prompt from the shared template in
// app/assets/mappings/prompt.txt, filling {{Context}} with the
// played dialogue and the bias list (equivalent to PromptManager.cs).

const MAPPINGS_PATH = "assets/mappings/";

let promptTemplatePromise = null;
let biasesPromise = null;

function loadPromptTemplate() {
    if (!promptTemplatePromise) {
        promptTemplatePromise = fetch(MAPPINGS_PATH + "prompt.txt")
            .then((response) => response.text())
            .catch((error) => {
                promptTemplatePromise = null;
                throw error;
            });
    }
    return promptTemplatePromise;
}

function loadBiasList() {
    if (!biasesPromise) {
        biasesPromise = fetch(MAPPINGS_PATH + "biases.txt")
            .then((response) => response.text())
            .then((text) => {
                const biases = text.split("\n").filter(Boolean).map((line) => {
                    const separatorIndex = line.indexOf(":");
                    return `- ${line.slice(0, separatorIndex)} (${line.slice(separatorIndex + 1).trim()})`;
                });
                return "Liste der Geschlechterbiases im Gründungsprozess:\n" + biases.join("\n");
            })
            .catch((error) => {
                biasesPromise = null;
                throw error;
            });
    }
    return biasesPromise;
}

/**
 * Builds the complete prompt for the AI feedback request.
 * @param novelContext
 * @param {string} dialogueText the transcript of the played dialogue
 * @returns {Promise<string>} the prompt with the context filled in
 */
export async function buildFeedbackPrompt(novelContext, dialogueText) {
    const [template, biasList] = await Promise.all([loadPromptTemplate(), loadBiasList()]);
    const contextParts = [];
    if (novelContext) contextParts.push(novelContext);
    contextParts.push(`Dialog:\n${dialogueText}`);
    contextParts.push(biasList);
    return template.replace("{{Context}}", contextParts.join("\n\n"));
}