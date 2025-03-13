import createHttpError from 'http-errors';
import { UserProfileModel } from '../../db/models/UserProfileModel.js';

export const addToFavorites = async (_id, cardId) => {
    const user = await UserProfileModel.findOne({ userId: _id });
    if (!user) throw new createHttpError(404, `User ${_id} not found`);

    const cardExists = await UserProfileModel.exists({ _id: cardId });
    if (!cardExists) throw new createHttpError(404, `Card ${cardId} not found`);

    if (!user.favorite.some((fav) => fav.type === cardId)) {
        user.favorite.push({ type: cardId });
        await user.save();
    }
    return user.favorite;
};

export const deleteFavoriteCard = async (_id, cardId) => {
    const user = await UserProfileModel.findOne({ userId: _id });
    if (!user) throw new createHttpError(404, `User ${_id} not found`);

    user.favorite = user.favorite.filter(id => id.toString() !== cardId);
    await user.save();

    return user.favorite;
};

export const getFavoriteCards = async (userId) => {
    // Витягуємо тільки favorite
    const user = await UserProfileModel.find(userId).select("favorite");

    if (!user) throw new createHttpError(404, `User ${userId} not found`);
    if (!user.favorite || user.favorite.length === 0) return []; // Якщо пусто, одразу повертаємо масив

    // Дістаємо значення `type` з кожного об'єкта у `favorite`
    const favoriteIds = user.favorite.map(fav => fav.type);

    // Шукаємо картки по цих _id
    const favoriteCards = await UserProfileModel.find({ _id: { $in: favoriteIds } });

    return favoriteCards;
};