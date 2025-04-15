import createHttpError from "http-errors";

export const safeParseDescription = (description) => {
    let parsed = {};

    if (typeof description === 'string') {
        try {
            parsed = JSON.parse(description);
        }
        catch {
            throw createHttpError(400, "Invalid JSON format in 'description' field");
        }
    } else if (typeof description === 'object' && description !== null) {
        parsed = description;
    }

    if ("experience" in parsed && !Number.isInteger(parsed.experience)) {
        throw createHttpError(400, 'Field "experience" must be an integer number');
    }

    return parsed;
};