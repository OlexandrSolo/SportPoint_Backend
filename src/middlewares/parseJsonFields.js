import createHttpError from "http-errors";

export const parseJsonFields = (fields) => (req, rex, next) => {
    try {
        for (const field of fields) {
            if (req.body[field]) {
                req.body[field] = JSON.parse(req.body[field]);
            }
        }
        next();
    } catch {
        next(createHttpError(400, "Invalid JSON format"));
    }
};