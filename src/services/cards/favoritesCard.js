import createHttpError from 'http-errors';
import { UserProfileModel } from '../../db/models/UserProfileModel.js';


export const getFavoriteCards = async (userId, role) => {
  const user = await UserProfileModel.findOne({ userId });

  const favoriteList = user.favorite.filter(favCard => favCard.role === role).map(favCard => favCard.userId);

  const arrayList = await UserProfileModel.find({
    _id: { $in: favoriteList }, role
  });

  if (!arrayList.length) {
    throw createHttpError(404, "No matching cards found");
  }

  return arrayList;
};

export const addToFavorites = async (userId, favCardId) => {
  const user = await UserProfileModel.findOne({ userId });

  if (!user) throw createHttpError(404, "User not found");

  const isCardinFav = user.favorite.find(card => card.userId.toString() === favCardId.cardId);

  if (isCardinFav) {
    throw createHttpError(409, `This card in his favorites list`);
  }

  const favCard = await UserProfileModel.findById(favCardId.cardId);

  const updateUserFavorites = await UserProfileModel.findByIdAndUpdate(user._id,
    {
      $addToSet: {
        favorite: { userId: favCard._id, role: favCard.role }
      }
    },
    { new: true }
  );

  return updateUserFavorites;
};

export const deleteFavoriteCard = async (userId, cardId) =>
  await UserProfileModel.findOneAndUpdate(
    { userId },
    {
      $pull: {
        favorite: { userId: cardId }
      }
    },
    { new: true }
  );