import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Name is a required field',
  }),
  password: Joi.string().min(8).max(64).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 64 characters long',
    'any.required': 'Password is a required field',
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is a required field',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is a required field',
  }),
  token: Joi.string().required().messages({
    'string.base': 'Token must be a string',
    'any.required': 'Token is a required field',
  }),
});
