import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createUserProfileController,
  getUserProfileController,
} from '../controllers/userProfile/UserProfileControllers.js';
import { uploadFields } from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { userProfileSchemaJoi } from '../validation/users-profile/usersProfileValidation.js';
import { validateBody } from '../middlewares/validateBody.js';

const profileRouter = Router();

profileRouter.use(auth);
profileRouter.get('/', ctrlWrapper(getUserProfileController));

profileRouter.post(
  '/',
  uploadFields,
  validateBody(userProfileSchemaJoi),
  ctrlWrapper(createUserProfileController),
);

export default profileRouter;
