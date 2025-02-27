import Joi from 'joi';

import { patternLines } from '../../constants/patternLines';

const userRegisterSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().pattern(patternLines.EMAIL).required(),
    password: Joi.string().pattern(patternLines.PASSWORD).required(),
    role: Joi.string().required(),
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
