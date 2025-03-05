import * as clubTrainerService from "../../services/cards/Cards.js";
import { parseFilterParams } from "../../utils/parseFilterParams.js";
import { parsePaginationParams } from "../../utils/parsePaginationParams.js";
import { parseSortParams } from '../../utils/parseSortParams.js';

// 📌 Отримати всі картки 
export const getCardsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const clubsTrainers = await clubTrainerService.getAllCards({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter
    });

    res.json({
        status: 200,
        message: 'Successfully!',
        data: clubsTrainers
    });
};

// 📌 Отримати одну картку за ID
export const getCardByIdController = async (req, res) => { };

// 📌 Додати нову картку (авторизація потрібна)
export const createCardController = async (req, res) => { };

// 📌 Оновити картку за ID (авторизація потрібна)
export const updateCardController = async (req, res) => { };

// 📌 Видалити картку за ID (авторизація потрібна)
export const deleteCardController = async (req, res) => { };

