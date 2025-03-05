import { addToFavorites, deleteFavoriteCard, getFavoriteCards } from "../../services/cards/favoritesCard";

// Додати в обране
export const addToFavoritesCardController = async (req, res) => {
    const { userId } = req.user;
    const { cardId } = req.params;

    const updateFavorites = await addToFavorites(userId, cardId);

    res.status(200).json({
        status: 200,
        message: "Added to favorites",
        favorites: updateFavorites
    });
};

// Видалити з обраного
export const deleteFavoritesCardController = async (req, res) => {
    const { userId } = req.user;
    const { cardId } = req.params;

    const updateFavorites = await deleteFavoriteCard(userId, cardId);

    res.status(200).json({
        status: 200,
        message: "Successfully remove a card from favorites",
    });
};

// Отримати список обраного
export const getFavoritesCardController = async (req, res) => {
    const { userId } = req.user;

    const favorites = await getFavoriteCards(userId);

    res.status(200).json({
        data: favorites
    });
};