import fs from 'node:fs/promises';
import path from 'node:path';
import { getEnvVar } from './getEnvVar.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/userProfile.js';

const saveFileToUploadDir = async (file) => {
  const tempPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const uploadPath = path.join(UPLOAD_DIR, file.filename);


  try {
    await fs.access(tempPath);
    await fs.rename(tempPath, uploadPath);
  } catch (error) {
    console.error('Error moving file:', error);
  }
  if (!file || !file.filename) {
    throw new Error('File object is missing or has no filename');
  }

  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};

export default saveFileToUploadDir;
