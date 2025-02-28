import refreshTokenService from '../../services/auth/refreshTokenService.js';

const refreshToken = async (req, res) => {
   const user = req.user;
   const tokens = await refreshTokenService(user);

   res.status(200).json(tokens);
};

export default refreshToken;