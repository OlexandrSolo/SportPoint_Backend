import createHttpError from 'http-errors';
import { UserProfileModel } from '../../db/models/UserProfileModel.js';

export const addToFavorites = async (cardId, userId) => {
    console.log("services");
    const user = UserProfileModel.findById(userId);
    if (!user) throw new createHttpError(404, `User ${userId} not found`);

    const cardExists = await UserProfileModel.exists({ _id: cardId });
    if (!cardExists) throw new createHttpError(404, `Card ${userId} not found`);

    if (!user.favorites.includes(cardId)) {
        user.favorites.push(cardId);
        await user.save();
    }
    return user.favorites;
};

export const deleteFavoriteCard = async (userId, cardId) => {
    const user = UserProfileModel.findById(userId);
    if (!user) throw new createHttpError(404, `User ${userId} not found`);

    user.favorites = user.favorites.filter(id => id.tiString() !== cardId);
    await user.save();

    return user.favorites;
};

export const getFavoriteCards = async (userId) => {

    const user = UserProfileModel.findById(userId);
    if (!user) throw new createHttpError(404, `User ${userId} not found`);

    return user.favorites;
};