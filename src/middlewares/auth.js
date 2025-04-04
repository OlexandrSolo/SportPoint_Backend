import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { ErrorsApp } from '../constants/errors.js';
import Auth from '../db/models/auth.js';

dotenv.config();
const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: ErrorsApp.NOT_AUTHORIZED });
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await Auth.findById(id);

    if (!user || !user.token) {
      return res.status(401).json({ message: ErrorsApp.NOT_AUTHORIZED });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.message === 'Invalid signature' ||
      error.message === 'invalid token'
    ) {
      error.status = 401;
    }
    next(error);
  }
};

export default auth;
