import Joi from 'joi';
import { patternLines } from '../../constants/patternLines.js';
import { typeList } from '../../constants/clubTrainerList.js';

export const clubTrainerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': "Ім'я має бути текстовим значенням.",
    'any.required': "Ім'я є обов'язковим полем.",
  }),
  profileImage: Joi.string().uri().required().messages({
    // URL зображення профілю
    'any.required': "Фото профілю є обов'язковим полем.",
  }),
  contacts: Joi.object({
    phone: Joi.string().pattern(patternLines.PHONE).required().messages({
      'string.pattern.base':
        "Телефон має містити тільки цифри (може починатися з '+').",
      'any.required': "Телефон є обов'язковим полем.",
    }),
    email: Joi.string().pattern(patternLines.EMAIL).required().messages({
      'string.base': 'Email має бути текстовим значенням.',
      'string.email': 'Email має бути дійсною електронною адресою.',
      'any.required': "Email є обов'язковим полем.",
    }),
    social: Joi.array().items(Joi.string().uri().default([])),
  }).required(),
  address: Joi.string().required().messages({
    'string.base': 'Адреса має бути текстовим значенням.',
    'any.required': "Адреса є обов'язковим полем.",
  }),
  city: Joi.string().required().messages({
    'string.base': 'Місто має бути текстовим значенням.',
    'any.required': "Місто є обов'язковим полем.",
  }),
  descriptions: Joi.string().max(1000),
  rating: Joi.number().min(0).max(5).default(0),
  reviewCount: Joi.number().integer().default(0),
  type: Joi.string()
    .valid(...typeList)
    .required()
    .messages({
      // Ключове поле, щоб визначити тип
      'any.only': "Тип має бути або 'club', або 'trainer'.",
      'any.required': "Тип є обов'язковим полем.",
    }),
});

// схема для створення картки
export const createTrainerClubSchema = clubTrainerSchema;

// схема для оновлення картки
export const updateClubTrainerSchema = clubTrainerSchema.fork(
  Object.keys(clubTrainerSchema.describe().keys),
  (schema) => schema.optional(),
);

// схема для видалення картки
export const deleteClubTrainerSchema = Joi.object({
  id: Joi.string().hex().length(24).required(), // MongoDB ObjectId
});
