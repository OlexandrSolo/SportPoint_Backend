import { Router } from 'express';
import profileRouter from './userProfileRoute.js';
import searchRouter from './searchRoutes.js';

const router = Router();

router.use('/profile', profileRouter);
router.use('/search', searchRouter);

export default router;
