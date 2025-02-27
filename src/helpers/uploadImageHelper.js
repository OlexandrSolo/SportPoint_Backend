import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';

export const handleFileUpload = async (file) => {
  if (!file) return null;
  return getEnvVar('ENABLE_CLOUDINARY') === 'true'
    ? await saveFileToCloudinary(file)
    : await saveFileToUploadDir(file);
};

export const handleMultipleFileUploads = async (files) => {
  return Promise.all(files.map((file) => handleFileUpload(file)));
};
