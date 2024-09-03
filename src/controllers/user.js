import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { findUserByIdService, updateUserService } from '../services/user.js';
import { findUserByEmailService } from '../services/auth.js';
import bcrypt from 'bcrypt';

export const updateUserAvatar = async (req, res) => {
  const userId = req.user._id;
  const avatar = req.file;

  let avatarUrl;

  if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar, 'waterTracker');
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }
  console.log(avatarUrl);
  const updatedUser = await updateUserService(userId, {
    avatar: avatarUrl,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    avatar: updatedUser.avatar,
  });
};

export const getUserInfo = async (req, res) => {
  const userId = req.user._id;
  const user = await findUserByIdService(userId);

  res.status(200).json({
    name: user.name,
    email: user.email,
    gender: user.gender,
    avatar: user.avatar,
    waterRate: user.waterRate,
  });
};

export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const avatar = req.file;
  const { email, password, newPassword } = req.body;

  if (req.user.email !== email) {
    const user = await findUserByEmailService(email);

    if (user) {
      throw createHttpError(409, 'Email in use');
    }
  }

  if (password) {
    const isEqual = await bcrypt.compare(password, req.user.password);
    if (!isEqual) {
      throw createHttpError(401, 'Unauthorized');
    }
    if (newPassword) {
      req.body.password = await bcrypt.hash(newPassword, 10);
    } else {
      throw createHttpError(400, 'Missed new password');
    }
  }
  if (!password && newPassword) {
    throw createHttpError(401, 'Unauthorized');
  }

  let avatarUrl;

  if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      avatarUrl = await saveFileToCloudinary(avatar, 'waterTracker');
    } else {
      avatarUrl = await saveFileToUploadDir(avatar);
    }
  }

  const updatedUser = await updateUserService(userId, {
    ...req.body,
    avatar: avatarUrl,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    name: updatedUser.name,
    email: updatedUser.email,
    gender: updatedUser.gender,
    avatar: updatedUser.avatar,
    waterRate: updatedUser.waterRate,
  });
};
