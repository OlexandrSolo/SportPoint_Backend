import Joi from 'joi';

const dateSchema = Joi.object({
  startTime: Joi.date().messages({
    'date.base': 'Start time must be a valid date',
    'any.required': 'Start time is required',
  }),
  endTime: Joi.date().messages({
    'date.base': 'End time must be a valid date',
    'any.required': 'End time is required',
  }),
});

const selectionSchema = Joi.object({
  selectedType: Joi.string().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  city: Joi.string().messages({
    'string.base': 'City must be a string',
    'any.required': 'City is required',
  }),
  address: Joi.string().messages({
    'string.base': 'Address must be a string',
    'any.required': 'Address is required',
  }),
  avatar: Joi.string().uri().messages({
    'string.uri': 'Avatar must be a valid URL',
  }),
});

const WorkoutPlanSchema = Joi.array().items(
  Joi.object({
    date: dateSchema.required(),
    selection: selectionSchema.required(),
    selectedGym: Joi.string(),
  }),
);

export const updateWorkoutPlanSchema = Joi.array().items(
  Joi.object({
    date: dateSchema.optional(),
    selection: selectionSchema.optional(),
    selectedGym: Joi.string(),
  }),
);

export const updateWorkoutPlan = updateWorkoutPlanSchema;

export const createWorkoutPlan = WorkoutPlanSchema;
