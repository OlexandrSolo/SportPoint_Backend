import Joi from 'joi';

import { patternLines } from '../../constants/patternLines.js';
import { ErrorsApp } from '../../constants/errors.js';

const changePasswordSchema = (req, res, next) => {
  const schema = Joi.object({
  
    oldPassword: Joi.string().pattern(patternLines.PASSWORD).required().messages({
      'string.pattern.base': ErrorsApp.NOT_VALID_PASSWORD,
      'any.required': 'Password is required.',
    }),
    newPassword: Joi.string().pattern(patternLines.PASSWORD).required().messages({
      'string.pattern.base': ErrorsApp.NOT_VALID_PASSWORD,
      'any.required': 'Password is required.',
    }),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }

  next();
};

export default changePasswordSchema;