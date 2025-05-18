
import Auth from '../../db/models/auth.js';



const verifyEmailService = async (user) => {

  const verify = await Auth.findByIdAndUpdate(user._id, {
     verify: true,
     verificationToken: null,
   });

 

   return verify;
};

export default verifyEmailService;
