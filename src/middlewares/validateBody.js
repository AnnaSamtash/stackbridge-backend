import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const newError = createHttpError(400, 'Bad Request', {
      errors: error.details,
    });
    next(newError);
  }
};
