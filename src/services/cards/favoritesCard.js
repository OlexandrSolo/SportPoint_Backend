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

    const currentCard = await UserProfileModel.findOne({ _id: cardId });

    const isExistId = currentCard.favorite.find(({ userId }) => userId.toString() === user.userId.toString());
    
    if(isExistId) throw new createHttpError(404, `User ${user.firstLastName} already has this card in his favorites list`);

    const favorite = {
        userId: user.userId,
        role: user.role
    }

    await UserProfileModel.findByIdAndUpdate(cardId, { $push: { favorite } }, { new: true })
    return favorite;
};

// export const deleteFavoriteCard = async (_id, cardId) => {
//     const user = await UserProfileModel.findOne({ userId: _id });
//     if (!user) throw new createHttpError(404, `User ${_id} not found`);

//     user.favorite = user.favorite.filter(id => id.toString() !== cardId);
//     await user.save();

//     return user.favorite;
// };

export const deleteFavoriteCard = async (_id, cardId) => {
    const user = await UserProfileModel.findOne({ _id: cardId });
    if (!user) throw new createHttpError(404, `User ${_id} not found`);

    const favorite = user.favorite.filter(id => id.userId.toString() !== _id.toString());
    await user.save();
    await UserProfileModel.findByIdAndUpdate(cardId, { $set: { favorite } }, { new: true })
    return favorite;
};

// отримання списку обраних
// export const getFavoriteCards = async (userId) => {

//     const user = UserProfileModel.findById(userId);
//     console.log(userId)
//     if (!user) throw new createHttpError(404, `User ${userId} not found`);

//     return user.favorite;
// };

export const getFavoriteCards = async (userId, role) => {
    const favoriteArray = [];
    const users = await UserProfileModel.find();
    for (let i = 0; i < users.length; i++) {
        const isExistId = users[i].favorite.find(item => item.userId.toString() === userId.toString());
        
        if (isExistId) {
            if(users[i].role === role)
            favoriteArray.push(users[i])
        }
    }
    // console.log(favoriteArray.length);
    // if (!user) throw new createHttpError(404, `User ${userId} not found`);

    return favoriteArray;
};