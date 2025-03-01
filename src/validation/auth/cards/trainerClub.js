import Joi from "joi";
import { patternLines } from "../../../constants/patternLines";
import { typeList } from "../../../constants/clubTrainerList";

export const clubTrainerSchema = Joi.object({
    name: Joi.string().required(),
    profileImage: Joi.string().uri().required(),        // URL зображення профілю
    contacts: Joi.object({
        phone: Joi.string().pattern(patternLines.PHONE).required(),
        email: Joi.string().pattern(patternLines.EMAIL).required(),
        social: Joi.array().items(Joi.string().uri().default([]))
            .required(),
        address: Joi.string().required(),
        descriptions: Joi.string().max(1000),
        rating: Joi.number().min(0).max(5).default(0),
        reviewCount: Joi.number().integer().default(0),
        type: Joi.string().valid(...typeList).required() // Ключове поле, щоб визначити тип
    })
});