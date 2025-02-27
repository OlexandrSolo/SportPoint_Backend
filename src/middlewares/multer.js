import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/user.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]);
export { uploadFields };
