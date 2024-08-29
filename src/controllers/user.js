import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { findUserByIdService, updateUserService } from '../services/user.js';

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
    _id: user._id,
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
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    gender: updatedUser.gender,
    avatar: updatedUser.avatar,
    waterRate: updatedUser.waterRate,
  });
};
