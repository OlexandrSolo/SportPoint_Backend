import Joi from 'joi';
import { patternLines } from '../../constants/patternLines.js';

export const descriptionSchemaJoi = Joi.object({
  address: Joi.string().allow(null, ''),
  short_desc: Joi.string().allow(null, ''),
  abilities: Joi.string().allow(null, ''),
  schedule: Joi.array().items(Joi.date().iso()),
  price: Joi.string().allow(null, ''),
  social_links: Joi.array().items(Joi.string().uri()),
  phone: Joi.string().pattern(patternLines.PHONE).allow(null, ''),
});

export const userProfileSchemaJoi = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  avatar: Joi.string().uri().allow(null, ''),
  images: Joi.array().items(Joi.string().uri()).allow(null, ''),
  description: descriptionSchemaJoi.allow(null),
});
