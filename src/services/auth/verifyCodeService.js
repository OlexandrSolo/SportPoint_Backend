import bcrypt from 'bcryptjs';
import Auth from '../../db/models/auth.js';

const verifyCodeService = async (password, user) => {
   const hashedPassword = await bcrypt.hash(password, 10);
   
   await Auth.findByIdAndUpdate(user._id, {
     password: hashedPassword,
     verifyCode: null,
     verify: true,
   });
};

export default verifyCodeService;
