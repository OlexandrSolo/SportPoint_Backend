import refreshTokenService from '../../services/auth/refreshTokenService.js';

const refreshToken = async (req, res) => {
  const user = req.user;
  const tokens = await refreshTokenService(user);
  res.cookie('token', tokens.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json(tokens);
};

export default refreshToken;
