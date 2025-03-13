import { SORT_ORDER } from "../../constants/sortOrder.js";
import CardCollection from "../../db/models/Cards.js";
import { ReviewsCollection } from "../../db/models/Review.js";
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

    // Переписати під switch
    // Фільтр за містом
    if (filter.address) cardsQuery.where("address").regex(new RegExp(filter.address, 'i'));

    // Фільтр за типом(тренер або клуб)
    if (filter.type) cardsQuery.where("type").equals(filter.type);

    // Мінімальна кількість відгуків === популярності
    // if (filter.reviewCount) {

    //     cardsQuery.where("reviewCount").gte(filter.reviewCount);
    // }

    // Фільтр за ціновим діапазоном
    if (filter.minPrice) cardsQuery.where('price').gte(filter.minPrice);
    if (filter.maxPrice) cardsQuery.where('price').lte(filter.maxPrice);

    // Фільтр за послугами (класифікацією)
    if (filter.description && filter.description.abilities.length > 0) cardsQuery.where("abilities").in(filter.description.abilities);

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

    const cardIds = await UserProfileModel.find().select("_id").exec();
    console.log(cardIds);
    const cardIdList = cardIds.map(card => card._id);
    console.log(cardIdList);
    const reviewsCountData = await ReviewsCollection.aggregate([
        { $match: { cardId: { $in: cardIdList } } },
        { $group: { _id: "$cardId", reviewCount: { $sum: 1 } } }
    ]);



    console.log(reviewsCountData);

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