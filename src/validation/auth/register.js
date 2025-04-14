import Joi from 'joi';

import { patternLines } from '../../constants/patternLines.js';
import { ErrorsApp } from '../../constants/errors.js';

const userRegisterSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().pattern(patternLines.EMAIL).required().messages({
      'string.pattern.base': ErrorsApp.NOT_VALID_EMAIL,
      'any.required': 'Email is required.',
    }),
    password: Joi.string().pattern(patternLines.PASSWORD).required().messages({
      'string.pattern.base': ErrorsApp.NOT_VALID_PASSWORD,
      'any.required': 'Password is required.',
    }),
    role: Joi.string()
      .valid('customer', 'coach', 'adminClub')
      .default('customer')
      .optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phone: Joi.string().pattern(patternLines.PHONE).optional().messages({
      'string.pattern.base': ErrorsApp.NOT_VALID_PHONE,
    }),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    // abilities: Joi.string().optional(),
    abilities: Joi.array().items(Joi.string()).optional(),
    sport: Joi.string().optional(),
    avatar: Joi.string().uri(),
    images: Joi.array().items(Joi.string().uri()),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }

  next();
};

export default userRegisterSchema;
