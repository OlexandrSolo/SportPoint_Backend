import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import Auth from '../../db/models/auth.js';

import { ErrorsApp } from '../../constants/errors.js';

import loginService from '../../services/auth/loginService.js';

dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizeEmail = email.toLowerCase();

  const user = await Auth.findOne({ email: normalizeEmail });

  if (!user) {
    return res
      .status(401)
      .json({ message: ErrorsApp.NOT_USER(normalizeEmail) });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({ message: ErrorsApp.NOT_CORRECT_PASSWORD });
  }

  const tokens = await loginService(user);

  res.cookie('token', tokens.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in',
    token: tokens.token,
    refreshToken: tokens.refreshToken,
  });
};

export default login;
