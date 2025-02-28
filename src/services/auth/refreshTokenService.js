import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Auth from '../../db/models/auth.js';

// import sendMail from '../../utils/sendEmail.js';


dotenv.config();

const { SECRET_KEY } = process.env;

const refreshTokenService = async (user) => {
   
   const payload = { id: user._id };
   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
   const refreshToken = jwt.sign(payload, SECRET_KEY, {
     expiresIn: '7d',
   });

   await Auth.findByIdAndUpdate(user._id, {
     $set: { token, refreshToken },
   });
// await sendMail(
//   'vitaliyfront@gmail.com',
//   'Hello ✔',
//   'My name is Vitalii',
//   '<b>Hello world? My name is Vitalii!</b>',
// );
   return { token, refreshToken };
};

export default refreshTokenService;