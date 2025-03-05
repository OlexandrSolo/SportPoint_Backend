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
  if (!user.verify) {
    return res.status(401).json({ message: ErrorsApp.NOT_VERIFICATION(email) });
  }

  const tokens = await loginService(user);

  res.status(200).json(tokens);
};

export default login;
