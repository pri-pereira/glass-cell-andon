/**
 * terminalId.ts
 * Generates (or retrieves) a persistent UUID for this browser/device.
 * Stored in localStorage so it survives page refreshes and browser restarts.
 * Does NOT require the operator to be logged in.
 */

const STORAGE_KEY = "smartandon_terminal_id";

/** Simple UUID v4 generator (no external deps) */
const generateUUID = (): string => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Returns the terminal_id for this device.
 * If none exists in localStorage, generates one and persists it.
 */
export const getTerminalId = (): string => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return stored;
        const newId = generateUUID();
        localStorage.setItem(STORAGE_KEY, newId);
        return newId;
    } catch {
        // If localStorage is blocked (e.g. private mode), generate a session-only ID
        return generateUUID();
    }
};
