import User from '../db/models/user.js';
import bcrypt from 'bcrypt';

export const findUserByIdService = (userId) => User.findById(userId);

export const updateUserService = async (userId, userData = {}) => {
  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return User.findByIdAndUpdate(
      userId,
      { ...userData, password: hashedPassword },
      { new: true },
    );
  }

  return User.findByIdAndUpdate(userId, userData, { new: true });
};
