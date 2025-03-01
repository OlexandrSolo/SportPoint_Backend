import Auth from '../../db/models/auth.js';
import generateRandomNumber from '../../utils/generateRandomNumber.js';
import sendMail from '../../utils/sendEmail.js';

const sendCodeService = async (user) => {
   const verifyCode = generateRandomNumber();

   await sendMail(
     user.email,
     'Відновлення паролю!',
     'Ваш код для відновлення паролю',
     `<p>Ваш код для відновлення паролю: ${verifyCode}</p>`,
   );

   await Auth.findByIdAndUpdate(user._id, {
     verifyCode,
   });

};

export default sendCodeService;