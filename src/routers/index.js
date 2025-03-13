import { Router } from 'express';
import profileRouter from './userProfileRoute.js';
import searchRouter from './searchRoutes.js';
import CardsRouter from './cardsRoutes.js';

const router = Router();

router.use('/profile', profileRouter);
router.use('/search', searchRouter);
router.use("/cards", CardsRouter);

export default router;
