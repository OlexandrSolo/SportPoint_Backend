import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getUserProfileController,
  updatedUserProfileController,
} from '../controllers/userProfile/UserProfileControllers.js';
import { uploadFields } from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';
import { userProfileSchemaJoi } from '../validation/users-profile/usersProfileValidation.js';
import { validateBody } from '../middlewares/validateBody.js';
// import { parseJsonFields } from '../middlewares/parseJsonFields.js';

const profileRouter = Router();

profileRouter.use(auth);
profileRouter.get(
  '/',
  validateBody(userProfileSchemaJoi),
  ctrlWrapper(getUserProfileController),
);

profileRouter.patch(
  '/',
  uploadFields,
  // parseJsonFields,
  // validateBody(userProfileSchemaJoi),
  ctrlWrapper(updatedUserProfileController),
);

export default profileRouter;
