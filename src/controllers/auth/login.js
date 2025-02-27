import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Auth from '../../db/models/auth';

import { ErrorsApp } from '../../constants/errors';

dotenv.config();

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
   const { email, password } = req.body;
   const normalizeEmail = email.toLowerCase();

   const user = await Auth.findOne({ email: normalizeEmail });
  
   if (!user) {
    return res
      .status(401)
      .json({ message: ErrorsApp.NOT_USER(normalizeEmail)});
   }
   
   const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res
        .status(401)
        .json({ message: ErrorsApp.NOT_CORRECT_PASSWORD });
    }
   
    const payload = {
      id: user._id,
    };
   
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '7d',
    });
   
   await Auth.findByIdAndUpdate(user._id, { $set: { token, refreshToken } });

    res.status(201).json({
      token, refreshToken
    });
};

export default login;