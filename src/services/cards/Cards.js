import CardCollection from "../../db/models/Cards.js";

export const getAllCards = async () => await CardCollection.find();