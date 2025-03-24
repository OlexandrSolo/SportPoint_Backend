import { Router } from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

// import { isValidId } from "../middlewares/isValidId.js";

import * as favoritesCardController from "../controllers/cards/favoritesCard.js";

import auth from '../middlewares/auth.js';

const FavoritesCardsRouter = Router();

// Додати в обране
FavoritesCardsRouter.post("/:cardId", auth, ctrlWrapper(favoritesCardController.addToFavoritesCardController));

// Видалити з обраного
FavoritesCardsRouter.delete("/:cardId", auth, ctrlWrapper(favoritesCardController.deleteFavoritesCardController));

// Отримати список обраного
FavoritesCardsRouter.get("/", auth, ctrlWrapper(favoritesCardController.getFavoritesCardController));

export default FavoritesCardsRouter;