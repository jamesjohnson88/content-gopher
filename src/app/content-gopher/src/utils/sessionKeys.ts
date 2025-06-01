export interface SessionKeyParts {
    sessionName: string;
    category: string;
    difficulty: string;
    format: string;
}

/**
 * Generates a localStorage key for a session
 */
export function generateSessionKey(parts: SessionKeyParts): string {
    return `questions##${parts.sessionName}##${parts.category}##${parts.difficulty}##${parts.format}`;
}

/**
 * Parses a session key into its component parts
 */
export function parseSessionKey(key: string): SessionKeyParts | null {
    const parts = key.split('##');
    if (parts.length !== 5 || parts[0] !== 'questions') {
        return null;
    }

    return {
        sessionName: parts[1],
        category: parts[2],
        difficulty: parts[3],
        format: parts[4]
    };
}

/**
 * Finds a matching session key in localStorage
 */
export function findMatchingSessionKey(sessionName: string, format: string): string | null {
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('questions##'));
    return allKeys.find(key => {
        const parts = parseSessionKey(key);
        return parts && parts.sessionName === sessionName && parts.format === format;
    }) || null;
}

/**
 * Gets all session keys from localStorage
 */
export function getAllSessionKeys(): string[] {
    return Object.keys(localStorage).filter(key => key.startsWith('questions##'));
} 