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

// ── Persistência do chamado ativo ──────────────────────────────────────────
// Salva o ID do chamado em andamento para que, após reload, o FAB reapar eça.

const ACTIVE_CHAMADO_KEY = "smartandon_active_chamado_id";

/** Salva o ID do chamado recém-aberto no localStorage. */
export const saveActiveChamadoId = (id: string): void => {
    try {
        localStorage.setItem(ACTIVE_CHAMADO_KEY, id);
    } catch { /* silently ignore */ }
};

/** Retorna o ID do chamado ativo salvo, ou null se não houver. */
export const getActiveChamadoId = (): string | null => {
    try {
        return localStorage.getItem(ACTIVE_CHAMADO_KEY);
    } catch {
        return null;
    }
};

/** Remove o chamado ativo do localStorage (quando for concluído/divergência). */
export const clearActiveChamadoId = (): void => {
    try {
        localStorage.removeItem(ACTIVE_CHAMADO_KEY);
    } catch { /* silently ignore */ }
};
