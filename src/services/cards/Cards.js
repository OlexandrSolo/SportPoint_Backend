import { SORT_ORDER } from "../../constants/sortOrder.js";
import CardCollection from "../../db/models/Cards.js";
import { calculatePaginationData } from "../../utils/calculatePaginationData.js";

export const getAllCards = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = "rating",
    filter = {} }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const cardsQuery = CardCollection.find();

    // Фільтр за містом
    if (filter.address) cardsQuery.where("address").regex(new RegExp(filter.address, 'i'));

    // Фільтр за типом (тренер або клуб)
    if (filter.type) cardsQuery.where("type").equals(filter.type);

    // Мінімальна кількість відгуків
    if (filter.reviewCount) cardsQuery.where("reviewCount").gte(filter.reviewCount);

    // Фільтр за ціновим діапазоном
    if (filter.minPrice) cardsQuery.where('price').gte(filter.minPrice);
    if (filter.maxPrice) cardsQuery.where('price').lte(filter.maxPrice);

    // Фільтр за послугами (класифікацією)
    if (filter.services && filter.services.length > 0) cardsQuery.where("services").in(filter.services);

    // Сортування
    if (filter.sort) {
        switch (filter.sort) {
            case "нові":
                sortBy = "createdAt";
                sortOrder = "desc";
                break;
            case "популярні":
                sortBy = "reviewCount";
                sortOrder = "desc";
                break;
            case "ціна за зростанням":
                sortBy = "price";
                sortOrder = "asc";
                break;
            case "ціна за спаданням":
                sortBy = "price";
                sortOrder = "desc";
                break;
        }
    };

    const cardsCount = await CardCollection
        .find()
        .merge(cardsQuery)
        .countDocuments();

    const cards = await cardsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec();

    const paginationData = calculatePaginationData(cardsCount, perPage, page);

    return {
        data: cards,
        ...paginationData
    };
};

export const getCardById = async () => { };

export const createCard = async () => { };

export const updateCard = async () => { };

export const deleteCard = async () => { };