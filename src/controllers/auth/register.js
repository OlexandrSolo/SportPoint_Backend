
import Auth from '../../db/models/auth.js';
import { ErrorsApp } from '../../constants/errors.js';
import registerService from '../../services/auth/registerService.js';

const register = async (req, res) => {
   const { email, password } = req.body;
   const normalizeEmail = email.toLowerCase();

   const user = await Auth.findOne({ email: normalizeEmail });

   if (user) {
      return res.status(409).json({ message: ErrorsApp.EXIST_USER });
   }
   
   const newUser = await registerService(req, normalizeEmail, password);

   res.status(201).json({
      email: newUser.email,
   });
};

  export default register;