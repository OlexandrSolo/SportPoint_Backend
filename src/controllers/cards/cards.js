import createHttpError from 'http-errors';
import * as clubTrainerService from '../../services/cards/Cards.js';
import { parseFilterParams } from '../../utils/parseFilterParams.js';
import { parsePaginationParams } from '../../utils/parsePaginationParams.js';
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
    filter,
  });

  res.json({
    status: 200,
    message: `Successfully get cards by ${filter.role}!`,
    data: clubsTrainers,
  });
};

// Отримати одну картку за ID
export const getCardByIdController = async (req, res) => {
  const { id } = req.params;

  const card = await clubTrainerService.getCardById(id);

  if (!card) throw createHttpError(404, `Card with id=${id} not found`);

  res.status(200).json({
    status: 200,
    message: `Successfully found card with id ${id}!`,
    data: card,
  });
};
