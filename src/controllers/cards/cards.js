import createHttpError from "http-errors";
import * as clubTrainerService from "../../services/cards/Cards.js";
import { parseFilterParams } from "../../utils/parseFilterParams.js";
import { parsePaginationParams } from "../../utils/parsePaginationParams.js";
import { parseSortParams } from '../../utils/parseSortParams.js';

// Отримати всі картки 
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

// Отримати одну картку за ID
export const getCardByIdController = async (req, res) => {
    const { id } = req.query;

    const card = clubTrainerService.getCardById(id);

    if (!card) throw createHttpError(404, `Card with id=${id} not found`);

    res.status(201).json({
        status: 201,
        message: `Successfully found contact with id ${id}!`,
        data: card
    });
};

// Додати нову картку (авторизація потрібна)
export const createCardController = async (req, res) => {
    const ownerId = req.user._id;
    const newCard = await clubTrainerService.createCard({ ...req.body, owner: ownerId });

    //додати логіку додавання фото

    res.status(201).json({
        status: 201,
        message: "Successfully created a card",
        data: newCard,
    });
};

// Оновити картку за ID (авторизація потрібна)
export const updateCardController = async (req, res) => { };

// Видалити картку за ID (авторизація потрібна)
export const deleteCardController = async (req, res) => { };

