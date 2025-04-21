import Joi from 'joi';
import { patternLines } from '../../constants/patternLines.js';

const workSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
});

const descriptionSchemaJoi = Joi.object({
  address: Joi.string(),
  city: Joi.string(),
  short_desc: Joi.string(),
  abilities: Joi.array().items(Joi.string()),
  equipment: Joi.array().items(Joi.string()),
  age: Joi.string(),
  // experience: Joi.array().items(Joi.date().iso()),
  experience: Joi.number(),
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
      description: Joi.string(),
      amount: Joi.string().required(),
    }),
  ),
  phone: Joi.string().pattern(patternLines.PHONE),
  email: Joi.string().email(),
});

export const userProfileSchemaJoi = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  avatar: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri()),
  certificates: Joi.array().items(Joi.string().uri()),
  description: descriptionSchemaJoi.optional(),
  club: workSchema,
  coach: workSchema,
  //TODO change if you need
  favorite: Joi.array().items(Joi.object({ type: Joi.string() })),
  sport: Joi.string(),
});

export const userProfileUpdateSchemaJoi = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
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
  coach: Joi.array()
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
