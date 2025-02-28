import Auth from '../../db/models/auth.js';
import { ErrorsApp } from '../../constants/errors.js';

import verifyCodeService from '../../services/auth/verifyCodeService.js';

const verifyCode = async (req, res) => {
   const { password, verifyCode } = req.body;

   const user = await Auth.findOne({ verifyCode });
   if (!user) {
     return res.status(401).json({ message: ErrorsApp.BAD_CODE });
   }

   await verifyCodeService(password, user);
   
   res.status(201).json({
     message: 'Ваш пароль успішно оновлено!',
   });
   
};

export default verifyCode;