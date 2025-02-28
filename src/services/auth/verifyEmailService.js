import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Auth from '../../db/models/auth.js';

dotenv.config();

const { SECRET_KEY } = process.env;

const verifyEmailService = async (user) => {

   await Auth.findByIdAndUpdate(user._id, {
     verify: true,
     verificationToken: null,
   });

   const payload = { id: user._id };
   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
   const refreshToken = jwt.sign(payload, SECRET_KEY, {
     expiresIn: '7d',
   });
   
   await Auth.findByIdAndUpdate(user._id, {
     $set: { token, refreshToken },
   });

   return { token, refreshToken };
};

export default verifyEmailService;
