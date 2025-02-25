import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { logger } from './middlewares/logger.js';

const PORT = Number(getEnvVar("PORT", "3000"));

export const startServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use(logger);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
