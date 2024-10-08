import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { findUserByIdService } from '../services/user.js';

export const checkToken = async (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }
  const [bearer, token] = header.split(' ');
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }
  try {
    const { userId } = jwt.verify(token, env('SECRET_JWT'));

    const user = await findUserByIdService(userId);

    if (!user || !user.token || user.token !== token) {
      next(createHttpError(401, 'Unauthorized'));
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(createHttpError(401, 'Unauthorized'));
  }
};
