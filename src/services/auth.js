import User from '../db/models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

export const findUserByEmailService = (email) =>
  User.findOne({
    email,
  });

export const updateUserWithTokenService = (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    env('SECRET_JWT'),
  );
  return User.findByIdAndUpdate(userId, { token }, { new: true });
};

export const createUserService = async (userData) => {
  const { password } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ ...userData, password: hashedPassword });

  return updateUserWithTokenService(user._id);
};

export const logoutService = (userId) =>
  User.findByIdAndUpdate(userId, { token: '' });
