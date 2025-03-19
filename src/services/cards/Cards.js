import { SORT_ORDER } from "../../constants/sortOrder.js";
// import { ReviewsCollection } from "../../db/models/Review.js";
import { UserProfileModel } from "../../db/models/UserProfileModel.js";
import { calculatePaginationData } from "../../utils/calculatePaginationData.js";

export const getAllCards = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = "rating",
    filter = {} }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const cardsQuery = UserProfileModel.find();

    // Переписати під switch ❌

    // Фільтр за містом
    if (filter.address) cardsQuery.where("description.address").regex(new RegExp(filter.address, 'i'));

    // Фільтр за типом(тренер або клуб)
    if (filter.role) cardsQuery.where("role").equals(filter.role);

    // Мінімальна кількість відгуків === популярності
    if (filter.countReview) cardsQuery.where("countReview").gte(filter.countReview);

    // Фільтр за ціновим діапазоном
    if (filter.minPrice) cardsQuery.where('description.price.amount').gte(filter.minPrice);
    if (filter.maxPrice) cardsQuery.where('description.price.amount').lte(filter.maxPrice);

    // Фільтр за послугами (класифікацією)
    if (filter.abilities && filter.abilities.length > 0) cardsQuery.where("description.abilities").in(filter.abilities);

    // Сортування
    if (filter.sort) {
        switch (filter.sort) {
            case "нові":
                sortBy = "createdAt";
                sortOrder = "asc";
                break;
            case "популярні":
                sortBy = "countReview";
                sortOrder = "asc";
                break;
            case "ціна за зростанням":
                sortBy = "description.price.amount";
                sortOrder = "asc";
                break;
            case "ціна за спаданням":
                sortBy = "description.price.amount";
                sortOrder = "desc";
                break;
        }
    };

    const cardsCount = await UserProfileModel
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

export const getCardById = async (id) => await UserProfileModel.findOne({ _id: id });