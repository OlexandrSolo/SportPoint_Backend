import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createUserProfileController,
  getUserProfileController,
} from '../controllers/UserProfileControllers.js';
import { uploadFields } from '../middlewares/multer.js';

const profileRouter = Router();

profileRouter.get('/profile/:userId', ctrlWrapper(getUserProfileController));
profileRouter.post(
  '/profile',
  uploadFields,
  ctrlWrapper(createUserProfileController), 
);
export default profileRouter;
