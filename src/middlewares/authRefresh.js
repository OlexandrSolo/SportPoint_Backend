import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { ErrorsApp } from '../constants/errors.js';
import Auth from '../db/models/auth.js';

dotenv.config();
const { SECRET_KEY } = process.env;

const authRefresh = async (req, res, next) => { 
   const { authorization = '' } = req.headers;
   const [bearer, refreshToken] = authorization.split(' ');
   
     if (bearer !== 'Bearer') {
       return res.status(401).json({ message: ErrorsApp.NOT_AUTHORIZED });
     }
   
   try {
     const { id } = jwt.verify(refreshToken, SECRET_KEY);
     const user = await Auth.findById(id);

     if (!user || !user.refreshToken) {
       return res.status(401).json({ message: ErrorsApp.NOT_AUTHORIZED });
     }

     req.user = user;
     next();
   } catch (error) {
     if (
       error.message === 'Invalid sugnature' ||
       error.message === 'invalid refreshToken'
     ) {
       error.status = 401;
     }
     next(error);
   }
};

export default authRefresh;