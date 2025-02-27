import express from 'express';

import ctrlWrapper from '../utils/ctrlWrapper';
import auth from '../middlewares/auth';

//controllers
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';
import logout from '../controllers/auth/logout';

// validation
import userRegisterSchema from '../validation/auth/register';
import userLoginSchema from '../validation/auth/login';

const router = express.Router();

router.post('/signup', userRegisterSchema, ctrlWrapper(register));
router.post('/signin', userLoginSchema, ctrlWrapper(login));
router.post('/logout', auth, ctrlWrapper(logout));