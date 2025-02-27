import Joi from 'joi';

import { patternLines } from '../../constants/patternLines.js';

const userLoginSchema = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(patternLines.EMAIL).required(),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }

  next();
};

export default userLoginSchema;
