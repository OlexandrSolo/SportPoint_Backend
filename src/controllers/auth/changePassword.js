import bcrypt from 'bcryptjs';
import changePasswordService from '../../services/auth/changePasswordService.js';
import { ErrorsApp } from '../../constants/errors.js';

const changePassword = async (req, res) => {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    
   if (!passwordMatch) {
      return res.status(409).json({ message: ErrorsApp.NOT_CORRECT_PASSWORD });
   }

    await changePasswordService(user, newPassword);

     res.status(200).json({
      message: "Пароль успішно змінено!",
      
   });

}

export default changePassword;