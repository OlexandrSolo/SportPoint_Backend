import * as clubTrainerService from "../../services/cards/Cards.js";

// 📌 Отримати всі картки 
export const getCardsController = async (req, res) => {
    const clubsTrainers = await clubTrainerService.getAllCards();
    console.log("Fetched from DB:", clubsTrainers);
    res.json({
        status: 200,
        data: clubsTrainers
    });
};

// 📌 Отримати одну картку за ID
export const getCardByIdController = async (req, res) => { };

// 📌 Додати нову картку (авторизація потрібна)
export const createCardController = async (req, res) => { };

// 📌 Оновити картку за ID (авторизація потрібна)
export const updateCardController = async (req, res) => { };

// 📌 Видалити картку за ID (авторизація потрібна)
export const deleteCardController = async (req, res) => { };

