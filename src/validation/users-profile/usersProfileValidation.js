import Joi from 'joi';
import { patternLines } from '../../constants/patternLines.js';

export const descriptionSchemaJoi = Joi.object({
  address: Joi.string(),
  short_desc: Joi.string(),
  abilities: Joi.string(),
  equipment: Joi.array().items(Joi.string()),
  experience: Joi.array().items(Joi.date().iso()),
  schedule: Joi.array().items(
    Joi.object({
      days: Joi.string(),
      hours: Joi.string(),
      date: Joi.date().iso(),
    }),
  ),
  social_links: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      url: Joi.string().uri().required(),
    }),
  ),
  price: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      amount: Joi.string().required(),
    }),
  ),
  phone: Joi.string().pattern(patternLines.PHONE),
  email: Joi.string().email(),
});

export const userProfileSchemaJoi = Joi.object({
  firstLastName: Joi.string().min(2).max(50),
  avatar: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri()),
  certificates: Joi.array().items(Joi.string().uri()),
  description: descriptionSchemaJoi.optional(),
  club: Joi.array().items(Joi.string()).optional(),
  couch: Joi.array().items(Joi.string()).optional(),

  //TODO change if you need
  favorite: Joi.array().items(Joi.object({ type: Joi.string() })),
});

export const userProfileUpdateSchemaJoi = Joi.object({
  name: Joi.string().min(2).max(50),
  avatar: Joi.string().uri().allow(null, ''),
  images: Joi.array().items(Joi.string().uri()),
  club: Joi.array()
    .items(Joi.string())
    .optional()
    .custom((value, helpers) => {
      const uniqueValues = new Set(value);
      if (uniqueValues.size !== value.length) {
        return helpers.message('Array elements must be unique');
      }
      return value;
    }),
  couch: Joi.array()
    .items(Joi.string())
    .optional()
    .custom((value, helpers) => {
      const uniqueValues = new Set(value);
      if (uniqueValues.size !== value.length) {
        return helpers.message('Array elements must be unique');
      }
      return value;
    }),
  //TODO change if you need
  favorite: Joi.array().items(Joi.object({ type: Joi.string() })),
  description: descriptionSchemaJoi.optional(),
});
