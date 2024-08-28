import {
  createUserService,
  logoutService,
  updateUserWithTokenService,
} from '../services/auth.js';
import createHttpError from 'http-errors';
import { findUserByEmailService } from '../services/auth.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmailService(email);
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const newUser = await createUserService(req.body);
  res.status(201).json({
    user: {
      email: newUser.email,
    },
    token: newUser.token,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmailService(email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'User not found');
  }
  const updatedUser = await updateUserWithTokenService(user._id);

  res.status(200).json({
    user: {
      email: updatedUser.email,
    },
    token: updatedUser.token,
  });
};

export const logout = async (req, res) => {
  const userId = req.user._id;
  await logoutService(userId);

  res.status(204).send();
};

export const refreshUser = (req, res) => {
  const { email } = req.user;

  res.status(200).json({
    email,
  });
};
