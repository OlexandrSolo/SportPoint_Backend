import Joi from 'joi';

const updateWorkSchema = (req, res, next) => {


    const dateSchema = Joi.object({
  day: Joi.string().required(),
  date: Joi.string().pattern(/^\d{2}\.\d{2}\.\d{4}$/).required(),
  hourStart: Joi.string().required(),
  hourEnd: Joi.string().required()
});

const clubSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
  name: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  avatar: Joi.string().uri().required()
});

  const workSchema = Joi.object({
  date: dateSchema.required(),
  club: clubSchema.required(),
  gym: Joi.string().required()
  });

  const validationResult = workSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      message: validationResult.error.details[0].message,
    });
  }

  next();
};

export default updateWorkSchema;