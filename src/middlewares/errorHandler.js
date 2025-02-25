import { HttpError } from 'http-errors';

export const errorHandler = async (err, req, res, _next) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({
            status: err.status,
            message: err.name,
            data: err
        });
        return;
    }

    const { status = 500, message = "Server error" } = err;
    res.status(status).json({
        status,
        message,
    });
};