import * as authService from '../services/auth.service.js';

export async function login(req, res) {
  try {
    const { token, tokenType, user } = await authService.login(req.body);

    res.json({
      message: 'Autenticación exitosa',
      accessToken: token,
      tokenType,
      user,
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
