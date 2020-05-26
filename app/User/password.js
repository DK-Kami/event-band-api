import crypto from 'crypto';
import Router from '../Base/Router';
import AuthorizedUser from './AuthorizedUser';
import User from './User';

const passwordRouter = new Router();

/**
 * Запрос на изменение пароля
 */
passwordRouter.get('/request-password', async (req, res) => {
  const { email } = req.query;
  const user = await User.getOne({
    where: { email },
  });

  if (!user) {
    res.status(400).send({
      message: 'Email not found',
      type: 'error',
    });
  }

  const authUser = await user.getAuthorizedUser();
  const refreshToken = crypto.randomBytes(32).toString('hex');
  authUser.refreshToken = refreshToken;
  AuthorizedUser.sendEmail(email, refreshToken);
  authUser.save();

  res.status(200).send({
    message: 'Check your email',
    type: 'success',
  });
});

/**
 * Изменение пароля по токену
 */
passwordRouter.post('/change-password', async (req, res) => {
  const {
    password,
    token,
  } = req.body;

  try {
    const authUser = await AuthorizedUser.getOne({
      where: { refreshToken: token },
    });

    if (!authUser) throw new Error;

    authUser.salt = crypto.randomBytes(16).toString('hex');
    authUser.password = AuthorizedUser.cryptoPassword(password, authUser.salt);
    authUser.refreshToken = '';
    await authUser.save();

    return res.status(200).send({
      message: 'All ok',
    });
  }
  catch(e) {
    return res.status(400).send({
      message: 'wrong token',
    });
  }
});

export {
  passwordRouter,
};
