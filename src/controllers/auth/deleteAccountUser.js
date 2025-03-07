import deleteAccountUserService from '../../services/auth/deleteAccountUserService.js';
import { ErrorsApp } from '../../constants/errors.js';

const deleteAccountUser = async (req, res) => {
  const { _id } = req.user;
  await deleteAccountUserService(_id);
  res.status(204).json({
    message: ErrorsApp.DELETE_ACCOUNT,
  });
};

export default deleteAccountUser;
