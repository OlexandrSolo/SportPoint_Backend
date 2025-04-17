import { Router } from 'express';
import profileRouter from './userProfileRoute.js';
import searchRouter from './searchRoutes.js';
import authRouter from './auth.js';
import reviewRoutes from './reviews.js';
import CardsRouter from './cardsRoutes.js';
import FavoritesCardsRouter from './favoriteRoutes.js';
import worksRouter from './works.js';

const router = Router();

router.use("/auth", authRouter);
router.use('/cards', CardsRouter);
router.use('/profile', profileRouter);
router.use("/favorites", FavoritesCardsRouter);
router.use('/search', searchRouter);
router.use('/reviews', reviewRoutes);
router.use('/works', worksRouter);


export default router;
