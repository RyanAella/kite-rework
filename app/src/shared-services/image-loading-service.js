import { fetchFromJson } from "./fetch-service.js";

/**
 * Service class responsible for image preloading and memory cache allocation.
 * By preemptively instantiating `Image` objects, this service forces the browser's rendering engine 
 * to execute HTTP GET requests before the assets are strictly required in the Document Object Model (DOM). 
 */
export class ImageLoadingService {

    static imageCache = new Map();
    
    /**
     * Asynchronously fetches the static image paths and multiplexes the network requests.
     * * This method implements a fault-tolerant concurrency model. By resolving the promises 
     * even on `onerror` events, it ensures that the main application lifecycle is not halted 
     * by individual 404 (Not Found) network errors. The execution thread will strictly yield 
     * until the entire asset pipeline has finished processing.
     * * @returns {Promise<void>} Resolves when all asset requests have been either successfully cached or safely caught.
     * @throws {Error} Throws if the asset is malformed, unreachable, or fails structural validation.
     */
    static async loadImages() {
        
        try {
            const imagePaths = await fetchFromJson("assets/json/image-paths.json");
            console.log(imagePaths);

            if (!Array.isArray(imagePaths)) {
                throw new Error("No valid array.");
            }

            const BATCH_SIZE = 25; 
            let loadedCount = 0;

            for (let i = 0; i < imagePaths.length; i += BATCH_SIZE) {

                const currentBatch = imagePaths.slice(i, i + BATCH_SIZE);

                const promises = currentBatch.map(path => {
                    return new Promise(async (resolve) => {
                        const img = new Image();

                        img.onerror = () => {
                            console.error(`Error at: ${path}`);
                            resolve(); 
                        };

                        img.src = path;
                        
                        try {
                            await img.decode();
                            
                            // Prevent image object to be collected from Garbage Collector
                            ImageLoadingService.imageCache.set(path, img);
                            
                            resolve();
                        } catch (error) {
                            resolve();
                        }
                    });
                });

                await Promise.all(promises);
                loadedCount += currentBatch.length;
                console.log(`Preloading Fortschritt: ${loadedCount} / ${imagePaths.length}`);
            }

        } catch (error) {
            console.error("Error at preloading service: ", error);
        }
    }
}