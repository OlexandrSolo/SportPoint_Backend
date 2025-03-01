import { Router } from "express";

import { validateBody, ctrlWrapper } from "../utils/validateBody.js";

import { clubTrainerSchema, createTrainerClubSchema, updateClubTrainerSchema, deleteClubTrainerSchema } from "../validation/auth/cards/trainerClub.js";

const cardsRouter = Router();

cardsRouter.post();