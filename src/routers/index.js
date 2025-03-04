import { Router } from 'express';
import profileRouter from './userProfileRoute.js';

const router = Router();

router.use('/profile', profileRouter);

export default router;
