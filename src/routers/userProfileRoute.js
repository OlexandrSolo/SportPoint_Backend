import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createUserProfileController,
  getUserProfileController,
} from '../controllers/UserProfileControllers.js';
import { uploadFields } from '../middlewares/multer.js';
import authRefresh from '../middlewares/authRefresh.js';

const profileRouter = Router();

profileRouter.get('/profile/:userId', ctrlWrapper(getUserProfileController));
profileRouter.use(authRefresh);
profileRouter.post(
  '/profile',
  uploadFields,
  ctrlWrapper(createUserProfileController),
);
export default profileRouter;
