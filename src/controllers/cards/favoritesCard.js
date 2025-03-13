import { addToFavorites, deleteFavoriteCard, getFavoriteCards } from "../../services/cards/favoritesCard.js";

// Додати в обране
export const addToFavoritesCardController = async (req, res) => {
    const { _id } = req.user;
    const { cardId } = req.query;

    const updateFavorites = await addToFavorites(_id, cardId);

    res.status(200).json({
        status: 200,
        message: "Added to favorites",
        favorites: updateFavorites
    });
};

// Видалити з обраного
export const deleteFavoritesCardController = async (req, res) => {
    const { _id } = req.user;
    const { cardId } = req.query;

    await deleteFavoriteCard(_id, cardId);

    res.status(200).json({
        status: 200,
        message: "Successfully remove a card from favorites",
    });
};

// Отримати список обраного
export const getFavCoachCardsController = async (req, res) => {
    const { _id: userId } = req.user;

    const favorites = await getFavoriteCards(userId);

    res.status(200).json({
        data: favorites
    });
};

export const getFavClubCardsController = async (req, res) => {

    const { _id: userId } = req.user;

    const favorites = await getFavoriteCards(userId);

    res.status(200).json({
        data: favorites
    });
};
