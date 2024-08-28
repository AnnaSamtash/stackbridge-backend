import createHttpError from 'http-errors';
import { updateUserService } from '../services/user.js';

export const updateWaterRate = async (req, res) => {
  const userId = req.user._id;
  const { waterRate } = req.body;

  const updatedUser = await updateUserService(userId, {
    waterRate,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    name: updatedUser.name,
    email: updatedUser.email,
    gender: updatedUser.gender,
    photo: updatedUser.photo,
    waterRate: updatedUser.waterRate,
  });
};
