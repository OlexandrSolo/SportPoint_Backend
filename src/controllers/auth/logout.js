import Auth from '../../db/models/auth.js';

const logout = async (req, res) => {
  const { _id } = req.user;
  await Auth.findByIdAndUpdate(_id, { token: null });

  res.status(204).json();
};

export default logout;