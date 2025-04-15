export const parseJsonFields = (req, res, next) => {
    const jsonLike = value =>
        typeof value === 'string' &&
        (value.trim().startsWith('{') || value.trim().startsWith('['));

    for (const key in req.body) {
        if (jsonLike(req.body[key])) {
            try {
                req.body[key] = JSON.parse(req.body[key]);
            } catch (err) {
                console.warn(`Failed to parse JSON field ${key}:`, err.message);
                // можна не падати, просто залишити як є
            }
        }
    }

    next();
};