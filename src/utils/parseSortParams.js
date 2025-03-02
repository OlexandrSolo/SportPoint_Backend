//онстанту sortOrder для параметрів запиту
import { SORT_ORDER } from "../constants/sortOrder.js";

//парсер квері параметрів для сортування

const parseSortOrder = (sortOrder) => {
    const isKnowOrder = [SORT_ORDER.ASC, SORT_ORDER.DSC].includes(sortOrder);

    if (isKnowOrder) return sortOrder;

    return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
    const keysOfCards = [
        "rating",
        "type",
        "address",
        "price",
        "createdAt",
        "updatedAt"
    ];

    if (keysOfCards.includes(sortBy)) return sortBy;

    return "rating";
};

export const parseSortParams = (query) => {
    const { sortOrder, sortBy } = query;

    const parsedSortOrder = parseSortOrder(sortOrder);
    const parsedSortBy = parseSortBy(sortBy);

    return {
        sortOrder: parsedSortOrder,
        sortBy: parsedSortBy,
    };
};