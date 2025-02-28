import Joi from 'joi';

import { patternLines } from '../../constants/patternLines.js';
import { ErrorsApp } from '../../constants/errors.js';

const sendCodeEmailSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().pattern(patternLines.EMAIL).required().messages({
      'string.pattern.base': ErrorsApp.NOT_VALID_EMAIL,
      'any.required': 'Email is required.',
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

export default sendCodeEmailSchema;