import createHttpError from 'http-errors';
import { UserProfileModel } from '../../db/models/UserProfileModel.js';

// Додавання в обрані
export const addToFavorites = async (_id, cardId) => {
  const user = await UserProfileModel.findOne({ userId: _id });

  if (!user) throw new createHttpError(404, `User ${_id} not found`);

  const cardExists = await UserProfileModel.exists({ _id: cardId });

  if (!cardExists) throw new createHttpError(404, `Card ${cardId} not found`);

  const currentCard = await UserProfileModel.findOne({ _id: cardId });

  const isExistId = currentCard.favorite.find(
    ({ userId }) => userId.toString() === user.userId.toString(),
  );

  if (isExistId)
    throw new createHttpError(
      409,
      `User ${user.firstName} ${user.lastName} already has this card in his favorites list`,
    );

  const favorite = {
    userId: user.userId,
    role: user.role,
  };

  await UserProfileModel.findByIdAndUpdate(
    cardId,
    { $push: { favorite } },
    { new: true },
  );
  return favorite;
};

export const deleteFavoriteCard = async (_id, cardId) => {
  const user = await UserProfileModel.findOne({ _id: cardId });
  if (!user) throw new createHttpError(404, `User ${_id} not found`);

  const favorite = user.favorite.filter(
    (id) => id.userId.toString() !== _id.toString(),
  );

  await UserProfileModel.findByIdAndUpdate(
    cardId,
    { $set: { favorite } },
    { new: true },
  );
  return favorite;
};

// отримання списку обраних
export const getFavoriteCards = async (userId, role) => {
  const favoriteArray = [];
  const users = await UserProfileModel.find();

  for (let i = 0; i < users.length; i++) {
    const favorites = Array.isArray(users[i].favorite) ? users[i].favorite : [];

    const isExistId = favorites.find(
      (item) => item.userId?.toString() === userId.toString(),
    );
    const isExistRole = favorites.find(
      (item) => item.role?.toString() === role.toString(),
    );

    if (isExistId && isExistRole) {
      favoriteArray.push(users[i]);
    }
  }

  return favoriteArray;
};
