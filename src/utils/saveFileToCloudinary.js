import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/userProfile.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  console.log(file);
  if (!file || !file.path) {
    throw new Error('File object is missing or has no path');
  }

  const response = await cloudinary.v2.uploader.upload(file.path);
  try {
    await fs.unlink(file.path);
  } catch (error) {
    console.error('Error deleting temp file:', error);
  }

  return response.secure_url;
};
