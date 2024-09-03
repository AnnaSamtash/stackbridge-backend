import {
  createUserService,
  logoutService,
  requestResetTokenService,
  resetPasswordService,
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
      name: newUser.name,
      email: newUser.email,
      gender: newUser.gender,
      avatar: newUser.avatar,
      waterRate: newUser.waterRate,
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
    throw createHttpError(401, 'Unauthorized');
  }
  const updatedUser = await updateUserWithTokenService(user._id);

  res.status(200).json({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      avatar: updatedUser.avatar,
      waterRate: updatedUser.waterRate,
    },
    token: updatedUser.token,
  });
};

export const logout = async (req, res) => {
  const userId = req.user._id;
  await logoutService(userId);

  res.status(204).send();
};

export const requestResetEmail = async (req, res) => {
  await requestResetTokenService(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetPassword = async (req, res) => {
  await resetPasswordService(req.body);

  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
