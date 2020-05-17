import passport from 'passport';
import Router from '../Base/Router';
import AuthorizedUser from './AuthorizedUser';
import User from './User';

const userRouter = new Router();
const authRouter = new Router();

/**
 * [DEBUG] Возвращение всех пользователей
 */
userRouter.get('/', async (req, res) => { 
  const users = await User.getAll();
  const authUsers = await AuthorizedUser.getAll();
  return res.status(200).send({ users, authUsers });
});

/**
 * Авторизация пользователя
 */
authRouter.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if(!email) {
    return res.status(400).send({
      error: 'Email is a required field',
    });
  }

  if(!password) {
    return res.status(400).send({
      error: 'Password is a required field',
    });
  }

  return passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      console.log('error', err);
      return res.status(400).send(err);
    }

    if (user) {
      user.token = AuthorizedUser.generateJWT(user.authUserUUID, user.userUUID);

      return res.status(200).json({ user });
    }

    console.log(user);
    return next(res.status(400));
  })(req, res, next);
});
/**
 * Регистрация нового пользователя
 */
authRouter.post('/register', async (req, res, next) => {
  const data = req.body;

  try {
    const user = await User.create(data);
    data.UserId = user.id;
    const authUser = await AuthorizedUser.create(data);
    authUser.token = AuthorizedUser.generateJWT(user.uuid, authUser.uuid);

    res.status(201).send({
      user: AuthorizedUser.toAuthJSON(authUser, user),
    });
  }
  catch(message) {
    console.log(message);
    res.status(400).send({ message });
  }
});

export {
  userRouter,
  authRouter,
};