import createHttpError from 'http-errors';
import { UserProfileModel } from '../../db/models/UserProfileModel.js';

// export const addToFavorites = async (_id, cardId) => {
//     const user = await UserProfileModel.findOne({ userId: _id });
//     console.log(user);
//     if (!user) throw new createHttpError(404, `User ${_id} not found`);

//     const cardExists = await UserProfileModel.exists({ _id: cardId });
//     if (!cardExists) throw new createHttpError(404, `Card ${cardId} not found`);

//     if (!user.favorite.some((fav) => fav.type === cardId)) {
//         user.favorite.push({ type: cardId });
//         await user.save();
//     }
//     return user.favorite;
// };

// Додавання в обрані
export const addToFavorites = async (_id, cardId) => {
    const user = await UserProfileModel.findOne({ userId: _id });
    
    if (!user) throw new createHttpError(404, `User ${_id} not found`);

    const cardExists = await UserProfileModel.exists({ _id: cardId });
    if (!cardExists) throw new createHttpError(404, `Card ${cardId} not found`);

    const favorite = {
        userId: user.userId,
        role: user.role
    }

    await UserProfileModel.findByIdAndUpdate(cardId, { $push: { favorite } }, { new: true })
    return favorite;
};

export const deleteFavoriteCard = async (_id, cardId) => {
    const user = await UserProfileModel.findOne({ userId: _id });
    if (!user) throw new createHttpError(404, `User ${_id} not found`);

    user.favorite = user.favorite.filter(id => id.toString() !== cardId);
    await user.save();

    return user.favorite;
};

export const getFavoriteCards = async (userId) => {

    const user = UserProfileModel.findById(userId);
    console.log(userId)
    if (!user) throw new createHttpError(404, `User ${userId} not found`);

    return user.favorite;
};