import createHttpError from "http-errors";

export const notFoundHandler = (req, res, _next) => {
    throw createHttpError(404, `Route ${req.url} nor found`);
};