import dotenv from 'dotenv';
import Auth from '../../db/models/auth.js';

import { ErrorsApp } from '../../constants/errors.js';

import verifyEmailService from '../../services/auth/verifyEmailService.js';

dotenv.config();

const { FRONT_END_LINK } = process.env;

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await Auth.findOne({ verificationToken });

  if (!user) {
    return res.status(401).json({ message: ErrorsApp.EMPTY_USER });
  }

  await verifyEmailService(user);

  res.writeHead(302, {
    'Location': `${FRONT_END_LINK}/login`
  });
  res.end();

};

export default verifyEmail;
