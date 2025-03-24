import { Router } from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import * as clubTrainer from "../controllers/cards/cards.js";

const CardsRouter = Router();

// Отримати всі картки (з фільтрами)
CardsRouter.get("/", ctrlWrapper(clubTrainer.getCardsController));

// Отримати одну картку за ID
CardsRouter.get("/:id", isValidId, ctrlWrapper(clubTrainer.getCardByIdController));

export default CardsRouter;