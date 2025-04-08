import dotenv from 'dotenv';
import Auth from '../../db/models/auth.js';
import generateRandomNumber from '../../utils/generateRandomNumber.js';
import sendMail from '../../utils/sendEmail.js';

dotenv.config();

const { VERIFY_CODE_LINK } = process.env;

const sendCodeService = async (user) => {
  const verifyCode = generateRandomNumber();
  
  const verifyLink = `${VERIFY_CODE_LINK}?code=${verifyCode}`;

   await sendMail(
     user.email,
     'Відновлення паролю!',
     'Ваш код для відновлення паролю',
     `<p>Ваше посилання для відновлення паролю: <a href="${verifyLink}">Відновити пароль</a></p>`,
   );

   await Auth.findByIdAndUpdate(user._id, {
     verifyCode,
   });

};

export default sendCodeService;