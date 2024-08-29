import createHttpError from 'http-errors';
import { updateUserService } from '../services/user.js';

export const updateWaterRate = async (req, res) => {
  const userId = req.user._id;
  const { waterRate } = req.body;

  const updatedUser = await updateUserService(userId, {
    waterRate,
  });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    waterRate: updatedUser.waterRate,
  });
};
