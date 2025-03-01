import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import validateBody from '../utils/validateBody.js';
import * as baseCardControllers from "../controllers/cards/baseCards.js";

import { clubTrainerSchema, createTrainerClubSchema, updateClubTrainerSchema, deleteClubTrainerSchema } from "../validation/auth/cards/trainerClub.js";

import auth from '../middlewares/auth.js';

const cardsRouter = Router();

//===============Base Cards=============

// 📌 Отримати всі картки (з фільтрами)
cardsRouter.get("/", ctrlWrapper(baseCardControllers.getCardsController()));

// 📌 Отримати одну картку за ID
cardsRouter.get("/:id", isValidId, validateBody(getClubTrainerById));

// 📌 Додати нову картку (авторизація потрібна)
cardsRouter.post("/", auth, validateBody(clubTrainerSchema), createClubTrainer);

// 📌 Оновити картку за ID (авторизація потрібна)
cardsRouter.patch("/:id", auth, isValidId, validateBody(updateClubTrainerSchema), updateClubTrainer);

// 📌 Видалити картку за ID (авторизація потрібна)
cardsRouter.delete("/:id", auth, isValidId, deleteClubTrainer);

//===============FAVORITES=============

// 📌 Додати в обране
cardsRouter.post("/favorites/:id", auth, isValidId, addToFavorites);

// 📌 Видалити з обраного
cardsRouter.delete("/favorites/:id", auth, isValidId, removeFromFavorites);

// 📌 Отримати список обраного
cardsRouter.get("/favorites", auth, getFavorites);

export default cardsRouter;