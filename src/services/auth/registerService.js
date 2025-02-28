import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Auth from '../../db/models/auth.js';
import sendMail from '../../utils/sendEmail.js';

dotenv.config();

const { VERIFY_EMAIL_LINK } = process.env;

const registerService = async (req, email, password) => {
  
  const hashPassword = await bcrypt.hash(password, 10);

  const emailVerificationToken = uuidv4();

  const verificationLink = `${VERIFY_EMAIL_LINK}${emailVerificationToken}`;

  const newUser = await Auth.create({
    ...req.body,
    email,
    password: hashPassword,
    verificationToken: emailVerificationToken,
  });

  await sendMail(
    email,
    'Підтвердження реєстрації у "Sport Point"',
    'Будь ласка, натисніть на посилання нижче для підтвердження вашої електронної пошти:',
    `<div><p>Будь ласка, натисніть на посилання нижче для підтвердження вашої електронної пошти:</p><a href="${verificationLink}">Підтвердити електронну пошту</a></div>`,
  );

  return newUser;
};

export default registerService;