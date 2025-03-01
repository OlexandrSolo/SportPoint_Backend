import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

import { getEnvVar } from './utils/getEnvVar.js';
// import { logger } from './middlewares/logger.js';

import authRouter from './routers/auth.js';
import reviewRoutes from './routers/reviews.js';

import { getAllTrainers } from './services/trainers.js';
import profileRouter from './routers/userProfileRoute.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  // app.use(logger);

  app.use('/api/auth', authRouter);
  app.use('/api/reviews', reviewRoutes);

  app.get('/trainers', async (req, res) => {
    const trainers = await getAllTrainers();

    res.status(200).json({
      data: trainers,
    });
  });

  app.use('/profile', profileRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
