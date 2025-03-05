import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";

import { isValidId } from "../middlewares/isValidId.js";

import * as favoritesCardController from "../controllers/cards/favoritesCard.js";

import auth from '../middlewares/auth.js';

const FavoritesCardsRouter = Router();

// Додати в обране
FavoritesCardsRouter.post("/favorites/:cardId", auth, isValidId, ctrlWrapper(favoritesCardController.addToFavoritesCardController));

// Видалити з обраного
FavoritesCardsRouter.delete("/favorites/:cardId", auth, isValidId, ctrlWrapper(favoritesCardController.deleteFavoritesCardController));

// Отримати список обраного
FavoritesCardsRouter.get("/favorites", auth, ctrlWrapper(favoritesCardController.getFavoritesCardController));

export default FavoritesCardsRouter;