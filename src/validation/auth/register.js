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
