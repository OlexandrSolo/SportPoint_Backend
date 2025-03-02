import Joi from 'joi';
import { patternLines } from '../../constants/patternLines.js';

export const descriptionSchemaJoi = Joi.object({
  address: Joi.string(),
  short_desc: Joi.string(),
  abilities: Joi.string(),
  schedule: Joi.array().items(Joi.date().iso()),
  price: Joi.string(),
  social_links: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      url: Joi.string().uri().required(),
    }),
  ),
  phone: Joi.string().pattern(patternLines.PHONE),
  email: Joi.string().pattern(patternLines.EMAIL),
  //TODO change if you need
  favorite: Joi.array().items(Joi.object({ type: Joi.string() })),
});

export const userProfileSchemaJoi = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  avatar: Joi.string().uri().allow(null, ''),
  images: Joi.array().items(Joi.string().uri()),
  description: descriptionSchemaJoi,
});

export const userProfileUpdateSchemaJoi = Joi.object({
  name: Joi.string().min(2).max(50),
  avatar: Joi.string().uri().allow(null, ''),
  images: Joi.array().items(Joi.string().uri()),
  description: descriptionSchemaJoi.optional(),
});
