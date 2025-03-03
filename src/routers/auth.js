import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import auth from '../middlewares/auth.js';
import authRefresh from '../middlewares/authRefresh.js';

//controllers
import register from '../controllers/auth/register.js';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import refreshToken from '../controllers/auth/refreshToken.js';
import verifyEmail from '../controllers/auth/verifyEmail.js';
import sendCode from '../controllers/auth/sendCode.js';
import verifyCode from '../controllers/auth/verifyCode.js';

// validation
import userRegisterSchema from '../validation/auth/register.js';
import userLoginSchema from '../validation/auth/login.js';
import sendCodeEmailSchema from '../validation/auth/sendCodeEmail.js';
import verifyCodeSchema from '../validation/auth/verifyCode.js';

const router = express.Router();

router.post('/signup', userRegisterSchema, ctrlWrapper(register));
router.post('/signin', userLoginSchema, ctrlWrapper(login));
router.post('/logout', auth, ctrlWrapper(logout));
router.get('/refresh/current', authRefresh, ctrlWrapper(refreshToken));
router.get('/verify/:verificationToken', ctrlWrapper(verifyEmail));
router.post('/send/verify', sendCodeEmailSchema, ctrlWrapper(sendCode));
router.post('/verify', verifyCodeSchema, ctrlWrapper(verifyCode));

export default router;
