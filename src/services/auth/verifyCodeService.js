import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Auth from '../../db/models/auth.js';

dotenv.config();

const { SECRET_KEY } = process.env;

const verifyCodeService = async (password, user) => {
  const hashedPassword = await bcrypt.hash(password, 10);

   const payload = {
    id: user._id,
  };
  
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: '7d',
  });

  await Auth.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    verifyCode: null,
    verify: true,
    token,
    refreshToken,
  });

  return { token, refreshToken };
};

export default verifyCodeService;
