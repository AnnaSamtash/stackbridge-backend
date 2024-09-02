import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(32).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must have at least {#limit} characters',
    'string.max': 'Name cannot exceed {#limit} characters',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().min(8).max(64).messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 64 characters long',
  }),
  newPassword: Joi.string().min(8).max(64).messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 64 characters long',
  }),
  gender: Joi.string().valid('woman', 'man').default('woman'),
  avatar: Joi.string().allow('').default(null),
  waterRate: Joi.number().default(2000),
});

export const waterRateSchema = Joi.object({
  waterRate: Joi.number().min(1).max(15000).required().messages({
    'number.base': 'Water rate must be a number',
    'number.min': 'Water rate must be most than or equal to 1',
    'number.max': 'Water rate must be less than or equal to 15000',
    'any.required': 'Water rate is a required field',
  }),
});
