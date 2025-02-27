import express from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import auth from '../middlewares/auth.js';

//controllers
import register from '../controllers/auth/register.js';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';

// validation
import userRegisterSchema from '../validation/auth/register.js';
import userLoginSchema from '../validation/auth/login.js';

const router = express.Router();

router.post('/signup', userRegisterSchema, ctrlWrapper(register));
router.post('/signin', userLoginSchema, ctrlWrapper(login));
router.post('/logout', auth, ctrlWrapper(logout));

export default router;
