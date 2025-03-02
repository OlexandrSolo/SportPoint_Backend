import { SORT_ORDER } from "../../constants/sortOrder.js";
import CardCollection from "../../db/models/Cards.js";
import { calculatePaginationData } from "../../utils/calculatePaginationData.js";

export const getAllCards = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = "rating" }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const cardsQuery = CardCollection.find();
    const cardsCount = await CardCollection
        .find()
        .merge(cardsQuery)
        .countDocuments();

    const cards = await cardsQuery.skip(skip).limit(limit).exec();

    const paginationData = calculatePaginationData(cardsCount, perPage, page);

    return {
        data: cards,
        ...paginationData
    };
};