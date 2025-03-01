import Auth from "../../db/models/auth.js";
import { ErrorsApp } from '../../constants/errors.js';

import sendCodeService from '../../services/auth/sendCodeService.js';

const sendCode = async (req, res) => {
   const { email } = req.body;
   const normalizeEmail = email.toLowerCase();

   const user = await Auth.findOne({ email: normalizeEmail });

   if (!user) {
     return res
       .status(401)
       .json({ message: ErrorsApp.NOT_USER(normalizeEmail) });
   }

   await sendCodeService(user);

   res
     .status(201)
     .json({
       message:
         'Код для оновлення паролю успішно відправлено на вашу електронну скриньку! Будь ласка перейдіть на неї для подальшого оновлення паролю!',
     });
};

export default sendCode;