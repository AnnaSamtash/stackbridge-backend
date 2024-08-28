import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';
import * as fs from 'node:fs/promises';
import { env } from '../utils/env.js';

cloudinary.config({
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file, folder) => {
  const response = await cloudinary.uploader.upload(file.path, { folder });
  await fs.unlink(file.path);

  return response.secure_url;
};
