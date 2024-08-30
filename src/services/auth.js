import User from '../db/models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import createHttpError from 'http-errors';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import Handlebars from 'handlebars';
import { sendEmail } from '../utils/sendMail.js';

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

export const requestResetTokenService = async (email) => {
  const user = await findUserByEmailService(email);
  if (!user) {
    throw createHttpError(404, 'User not Found');
  }

  const resetToken = jwt.sign(
    {
      id: user._id,
      email,
    },
    env('SECRET_JWT'),
    { expiresIn: '15m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = await fs.readFile(resetPasswordTemplatePath, {
    encoding: 'utf-8',
  });
  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later',
    );
  }
};

export const resetPasswordService = async (resetData) => {
  const { token, password } = resetData;
  try {
    const decoded = jwt.verify(token, env('SECRET_JWT'));

    const user = await User.findOne({
      email: decoded.email,
      _id: decoded.id,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, {
      password: encryptedPassword,
    });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    )
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }
};
