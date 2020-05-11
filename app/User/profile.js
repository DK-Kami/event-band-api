import crypto from 'crypto';
import Router from '../Base/Router';
import AuthorizedUser from './AuthorizedUser';
import User from './User';

const profileRouter = new Router();
const passwordRouter = new Router();

profileRouter.get('/', async (req, res) => {
  const { uuid } = req.payload;
  const user = await User.getByUUID(uuid);
  const authUser = await user.getAuthorizedUser();

  res.status(200).send({
    user: AuthorizedUser.toAuthJSON(authUser, user),
  });
});

profileRouter.put('/', async (req, res) => {
  const {
    authUserUUID,
    userUUID,
  } = req.payload;
  const {
    nickname,
    surname,
    email,
    name,
  } = req.body;

  try {
    const user = await User.update(
      { surname, email, name },
      { uuid: userUUID },
    );
    const authUser = await AuthorizedUser.update(
      { nickname },
      { uuid: authUserUUID },
    );
  
    res.status(200).send({
      user: AuthorizedUser.toAuthJSON(authUser, user),
    });
  }
  catch(message) {
    res.status(400).send({ message });
  }
});

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
  authUser.save();

  // res.status(200).send({ message: 'All ok' });
  res.status(200).send({
    message: 'nice dick, awesome balls',
    type: 'nice',
  });
});

passwordRouter.post('/change-password', async (req, res) => {
  const {
    password,
    token,
  } = req.body;

  console.log('password, token');
  try {
    console.log(password, token);
    const authUser = await AuthorizedUser.getOne({
      where: { refreshToken: token },
    });

    console.log(authUser);
    if (!authUser) throw new Error;

    authUser.salt = crypto.randomBytes(16).toString('hex');
    authUser.password = AuthorizedUser.cryptoPassword(password, authUser.salt);
    authUser.refreshToken = '';
    await authUser.save();

    res.status(200).send({
      message: 'All ok',
    });
  }
  catch(e) {
    console.log(e);
    res.status(400).send({
      message: 'wrong token',
    });
  }
});

export {
  profileRouter,
  passwordRouter,
};
