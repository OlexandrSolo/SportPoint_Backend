import { addToFavorites, deleteFavoriteCard, getFavoriteCards } from "../../services/cards/favoritesCard.js";

/* old my methods 
Додати в обране
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

Видалити з обраного
export const deleteFavoritesCardController = async (req, res) => {
    const { _id } = req.user;
    const { cardId } = req.query;

    await deleteFavoriteCard(_id, cardId);

    res.status(200).json({
        status: 200,
        message: "Successfully remove a card from favorites",
    });
};

Отримати список обраного
export const getFavoritesCardController = async (req, res) => {
    const { _id: userId } = req.user;

    const favorites = await getFavoriteCards(userId);

    res.status(200).json({
        data: favorites
    });
};
*/

/*Vitally methods
export const addToFavoritesCardController = async (req, res) => {
    const { _id } = req.user;
    const { cardId } = req.params;

    const updateFavorites = await addToFavorites(_id, cardId);

    res.status(200).json({
        status: 200,
        message: "Added to favorites",
        favorites: updateFavorites
    });
};
export const deleteFavoritesCardController = async (req, res) => {
    const { _id } = req.user;
    const { cardId } = req.params;

    await deleteFavoriteCard(_id, cardId);

    res.status(200).json({
        status: 200,
        message: "Successfully remove a card from favorites",
    });
};
export const getFavoritesCardController = async (req, res) => {
    const { _id: userId } = req.user;
    const { role } = req.query;

    const favorites = await getFavoriteCards(userId, role);

    res.status(200).json({
        data: favorites,
        total: favorites.length
    });
};
*/

//New My Methods
/*
Add to Fav
1. Витягнти id користувача
2. Витягнти id та role карточкb яку обрав для обраних
3. Повернути 200 - ок або те що карточка є вже в списку обраних
4. 
*/
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

export const deleteFavoritesCardController = async (req, res) => { };

export const getFavoritesCardController = async (req, res) => { };