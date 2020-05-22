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
authRouter.post('/register', (req, res) => {
  const data = req.body;

  User.create(data, (message, user) => {
    if (message) {
      return res.status(400).send({ message });
    }
    data.UserId = user.id;

    AuthorizedUser.create(data, (message, authUser) => {
      if (message) {
        return res.status(400).send({ message });
      }
      authUser.token = AuthorizedUser.generateJWT(user.uuid, authUser.uuid);

      return res.status(201).send({
        user: AuthorizedUser.toAuthJSON(authUser, user),
      });
    });
  });
});

export {
  userRouter,
  authRouter,
};
