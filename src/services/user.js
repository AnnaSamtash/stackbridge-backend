import User from '../db/models/user.js';

export const findUserByIdService = (userId) => User.findById(userId);

export const updateUserService = async (userId, userData = {}) => {
  return User.findByIdAndUpdate(userId, userData, { new: true });
};
