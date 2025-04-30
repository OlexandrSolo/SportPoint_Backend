import Joi from 'joi';

const reviewsSchema = (req, res, next) => {
  const schema = Joi.object({
    userCommentId: Joi.string().optional(),


    ratings: Joi.object({
        clientService: Joi.number().min(1).max(5).required(),
        serviceQuality: Joi.number().min(1).max(5).required(),
        priceQuality: Joi.number().min(1).max(5).required(),
        location: Joi.number().min(1).max(5).required(),
        cleanliness: Joi.number().min(1).max(5).required(),
    }).required(),
    comment: Joi.string().min(20).max(500).required(),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }

  next();
};

export default reviewsSchema;