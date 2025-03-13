import Joi from 'joi';

const replySchema = (req, res, next) => {
  const schema = Joi.object({ 
    adminReply: Joi.string().min(20).max(500).required(),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }

  next();
};

export default replySchema;