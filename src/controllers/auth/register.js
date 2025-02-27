import bcrypt from 'bcryptjs';
import Auth from '../../db/models/auth';
import { ErrorsApp } from '../../constants/errors';

const register = async (req, res) => {
   const { email, password } = req.body;
   const normalizeEmail = email.toLowerCase();

   const user = await Auth.findOne({ email: normalizeEmail });

   if (user) {
      return res.status(409).json({ message: ErrorsApp.EXIST_USER });
   }
   
   const hashPassword = await bcrypt.hash(password, 10);

   const newUser = await Auth.create({
      ...req.body,
      email: normalizeEmail,
      password: hashPassword,
   });

   res.status(201).json({
      email: newUser.email,
      name: newUser.name,
   });
};

  export default register;