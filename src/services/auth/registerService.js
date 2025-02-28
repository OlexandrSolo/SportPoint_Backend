import bcrypt from 'bcryptjs';
import Auth from '../../db/models/auth.js';


const registerService = async (req, email, password) => {
   const hashPassword = await bcrypt.hash(password, 10);

   const newUser = await Auth.create({
     ...req.body,
     email,
     password: hashPassword,
   });

   return newUser;
};

export default registerService;