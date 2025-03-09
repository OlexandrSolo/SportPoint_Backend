import bcrypt from 'bcryptjs';
import Auth from "../../db/models/auth.js";


const changePasswordService = async (user, newPassword) => {
    
  const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await Auth.findByIdAndUpdate(
      user._id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true },
    );
    
};

export default changePasswordService;