import createHttpError from "http-errors";
import { addToFavorites, deleteFavoriteCard, getFavoriteCards } from "../../services/cards/favoritesCard.js";

export const getFavoritesCardController = async (req, res) => {
    const user = req.user;
    const { role } = req.query;

    const data = await getFavoriteCards(user._id, role);

    res.status(200).json({
        status: 200,
        message: "Successfully search your favorite list",
        data
    });
};


export const addToFavoritesCardController = async (req, res) => {
    const { _id: userId } = req.user;
    const favCardId = req.params;

    const data = await addToFavorites(userId, favCardId);

    res.status(200).json({
        status: 200,
        message: "Successfully addition card on your favorite list",
        data
    });
};


export const deleteFavoritesCardController = async (req, res) => {
    const { _id } = req.user;
    const { cardId } = req.params;
    const data = deleteFavoriteCard({ _id }, cardId);

    if (!data) { throw createHttpError(404, "User not found or card not in favorites"); }

    res.status(200).json({
        status: 200,
        message: "Successfully deleted card from favorite list"
    });
};