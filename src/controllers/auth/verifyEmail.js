import Auth from '../../db/models/auth.js';

import { ErrorsApp } from '../../constants/errors.js';

import verifyEmailService from '../../services/auth/verifyEmailService.js';

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await Auth.findOne({ verificationToken });

  if (!user) {
    return res.status(401).json({ message: ErrorsApp.EMPTY_USER });
  }

  const tokens = await verifyEmailService(user);

  res.status(200).json(tokens);
};

export default verifyEmail;
