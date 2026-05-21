// All the different keys for the localStorage
// This class is used in the issue for the remember screen, I have copied the contents here to be able to use the storage.
export const STORAGE_KEYS = {
    bookmarkedNovels: 'bookmarkedNovels',
    knowledgeUIState: 'knowledgeUIState', // Storage Key for knowledge UI to save screen state
    pausedNovelStates: 'pausedNovelStates', 
};

// Helper function to read the JSON from the localStorage
export function readJson(storageKey, fallback) {
    let raw = null;
    try {
        raw = localStorage?.getItem(storageKey);
    } catch {
        return fallback;
    }
    if (raw == null) {
        return fallback;
    }
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

// Helper function to write the JSON to the localStorage
export function writeJson(storageKey, value) {
    try {
        localStorage?.setItem(storageKey, JSON.stringify(value));
    } catch {
        // Error handling
    }
}


// Remove the item from the localStorage
export function remove(storageKey) {
    try {
        localStorage?.removeItem(storageKey);
    } catch {
        // Ignore 
    }
}

export const novelStateStore = {
    load(novelName) {
        const states = readJson(STORAGE_KEYS.pausedNovelStates, {});
        return states[novelName] || null;
    },

    save(novelName, eventId) {
        const states = readJson(STORAGE_KEYS.pausedNovelStates, {});
        states[novelName] = eventId;
        writeJson(STORAGE_KEYS.pausedNovelStates, states);
    },

    clear(novelName) {
        const states = readJson(STORAGE_KEYS.pausedNovelStates, {});
        if (states[novelName]) {
            delete states[novelName];
            writeJson(STORAGE_KEYS.pausedNovelStates, states);
        }
    }
}

// Store for the bookmarked novels
export const bookmarkedNovelStore = {
    // Load the bookmarked novels from the localStorage
    load(validNames) {
        // Create a set of the valid names
        const valid = new Set(validNames);
        const names = readJson(STORAGE_KEYS.bookmarkedNovels, []);
        if (!Array.isArray(names)) {
            return new Set();
        }
        return new Set(names.filter((n) => typeof n === 'string' && valid.has(n)));
    },

    // Persist the bookmarked novels to the localStorage
    persist(set) {
        writeJson(STORAGE_KEYS.bookmarkedNovels, [...set]);
    },

    // Toggle the bookmarked novel
    toggle(set, novelName) {
        // If the novel is already in the set, delete it
        if (set.has(novelName)) {
            set.delete(novelName);
        } else {
            set.add(novelName);
        }
        this.persist(set);
    },
};
