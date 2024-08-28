import Joi from 'joi';

export const waterSchema = Joi.object({
  amount: Joi.number().min(50).max(5000).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be most than 50',
    'number.max': 'Amount must be less than or equal to 5000',
    'any.required': 'Amount is a required field',
  }),
  time: Joi.string().required().messages({
    'string.base': 'Time must be a string',
    'any.required': 'Time is a required field',
  }),
});

export const updateWaterSchema = Joi.object({
  amount: Joi.number().min(50).max(5000).messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be most than 50',
    'number.max': 'Amount must be less than or equal to 5000',
  }),
  time: Joi.string().messages({
    'string.base': 'Time must be a string',
  }),
});
