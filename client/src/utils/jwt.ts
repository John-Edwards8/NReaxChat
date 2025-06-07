export const extractUsernameFromToken = (token: string): string | null => {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;

        const decoded = JSON.parse(atob(payload));
        if (typeof decoded.sub === 'string') {
            return decoded.sub;
        }

        return null;
    } catch (e) {
        console.error("Failed to parse JWT for username:", e);
        return null;
    }
};
