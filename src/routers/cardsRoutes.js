import { Router } from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import * as clubTrainer from "../controllers/cards/cards.js";

import { clubTrainerSchema, createTrainerClubSchema, updateClubTrainerSchema, deleteClubTrainerSchema } from "../validation/cards/trainerClub.js";

import auth from '../middlewares/auth.js';

const CardsRouter = Router();

// Отримати всі картки (з фільтрами)
CardsRouter.get("/", ctrlWrapper(clubTrainer.getCardsController));

// Отримати одну картку за ID
CardsRouter.get("/:id", isValidId, validateBody(clubTrainerSchema), ctrlWrapper(clubTrainer.getCardByIdController));

// Додати нову картку (авторизація потрібна)
CardsRouter.post("/", auth, validateBody(createTrainerClubSchema), ctrlWrapper(clubTrainer.createCardController));

// Оновити картку за ID (авторизація потрібна)
CardsRouter.patch("/:id", auth, isValidId, validateBody(updateClubTrainerSchema), ctrlWrapper(clubTrainer.updateCardController));

// Видалити картку за ID (авторизація потрібна)
CardsRouter.delete("/:id", auth, isValidId, validateBody(deleteClubTrainerSchema), ctrlWrapper(clubTrainer.deleteCardController));

export default CardsRouter;