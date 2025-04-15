export const safeParseJSON = jsonString => {
    if (!jsonString) return {};
    try {
        return JSON.parse(jsonString);
    } catch {
        throw new Error('Invalid JSON format');
    }
};