import { SORT_ORDER } from "../../constants/sortOrder.js";
import { ReviewsCollection } from "../../db/models/Review.js";
import { UserProfileModel } from "../../db/models/UserProfileModel.js";
import { calculatePaginationData } from "../../utils/calculatePaginationData.js";

export const getAllCards = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = "rating",
    filter = {} }) => {

    const matchStage = {};
    const pipeline = [];

    pipeline.push({ $unwind: { path: "$description.price", preserveNullAndEmptyArrays: true } });

    pipeline.push({
        $addFields: {
            convertedPrice: {
                $convert: {
                    input: "$description.price.amount",
                    to: "double",
                    onError: 0,
                    onNull: 0
                }
            }
        }
    });

    if (filter.address) {
        matchStage['description.address'] = { $regex: filter.address, $options: "i" };
    }

    if (filter.city) {
        matchStage['description.city'] = { $regex: filter.city, $options: "i" };
    }

    if (filter.minPrice || filter.maxPrice) {
        const min = filter.minPrice ? Number(filter.minPrice) : 0;
        const max = filter.maxPrice ? Number(filter.maxPrice) : 1000000;

        matchStage['convertedPrice'] = { $gte: min, $lte: max };
    }

    if (filter.role) {
        matchStage['role'] = filter.role;
    }

    if (filter.countReview) {
        matchStage['countReview'] = { $gte: filter.countReview };
    }

    if (filter.rating) {
        matchStage['rating'] = { $gte: filter.rating };
    }

    if (filter.abilities && filter.abilities.length > 0) {
        matchStage['description.abilities'] = { $in: filter.abilities };
    }

    pipeline.push({ $match: matchStage });

    const sortDirection = sortOrder === "desc" ? -1 : 1;
    let sortField = 'createdAt';

    switch (filter.sort) {
        case "new":
            sortField = "createdAt";
            break;
        case "popular":
            sortField = 'countReview';
            break;
        case "price_asc":
        case "price_dsc":
            sortField = 'convertedPrice';
            break;
        default:
            sortField = 'createdAt';
    }

    pipeline.push({ $sort: { [sortField]: sortDirection } });

    if (typeof sortField !== 'string') {
        pipeline.unshift({ $addFields: { convertedPrice: sortField } });
    }

    const limit = perPage;
    const skip = (page - 1) * perPage;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const cards = await UserProfileModel.aggregate(pipeline);

    const totalResult = await UserProfileModel.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        { $count: "total" }
    ]);

    const totalItems = totalResult[0]?.total || 0;
    const paginationData = calculatePaginationData(totalItems, perPage, page);

    return {
        data: cards,
        ...paginationData
    };
};

export const getCardById = async (id) => {
    const card = await UserProfileModel.findOne({ _id: id });
    const userComments = await ReviewsCollection.findOne({ owner: card.userId });

    return {
        data: card,
        userComments
    };
};