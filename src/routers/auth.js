import express from 'express';

import ctrlWrapper from '../utils/ctrlWrapper';

//controllers
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';

// validation
import userRegisterSchema from '../validation/auth/register';
import userLoginSchema from '../validation/auth/login';

const router = express.Router();

router.post('/signup', userRegisterSchema, ctrlWrapper(register));
router.post('/signin', userLoginSchema, ctrlWrapper(login));
router.post('/logout', () => console.log('Logout'));