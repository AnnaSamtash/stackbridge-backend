import Joi from 'joi';

export const waterSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000).required().messages({
    'number.base': 'WaterVolume must be a number',
    'number.min': 'WaterVolume must be most than 1',
    'number.max': 'WaterVolume must be less than or equal to 5000',
    'any.required': 'WaterVolume is a required field',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Date must be a valid date',
    'any.required': 'Date is a required field',
  }),
});

export const updateWaterSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000).messages({
    'number.base': 'WaterVolume must be a number',
    'number.min': 'WaterVolume must be most than 1',
    'number.max': 'WaterVolume must be less than or equal to 5000',
  }),
  date: Joi.date().messages({
    'date.base': 'Date must be a valid date',
  }),
});
