import Joi from 'joi';

const usefulnessSchema = (req, res, next) => {

  const schema = Joi.object({
    useful: Joi.string().valid('yes', 'no').optional()
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }

  next();
};

export default usefulnessSchema;