import Joi from 'joi';

export const reviewSchema = Joi.object({
    club: Joi.string().optional(),
    trainer: Joi.string().optional(),
    ratings: Joi.object({
        clientService: Joi.number().min(1).max(5).required(),
        serviceQuality: Joi.number().min(1).max(5).required(),
        priceQuality: Joi.number().min(1).max(5).required(),
        location: Joi.number().min(1).max(5).required(),
        cleanliness: Joi.number().min(1).max(5).required(),
    }).required(),
    comment: Joi.string().min(20).max(500).required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
}).or('club', 'trainer'); 
