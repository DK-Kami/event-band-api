import passport from 'passport';
import Router from '../Base/Router';
import AuthorizedUser from './AuthorizedUser';
import User from './User';

const userRouter = new Router();
const authRouter = new Router();

userRouter.get('/', async (req, res) => { 
  const users = await User.getAll();
  const authUsers = await AuthorizedUser.getAll();
  return res.status(200).send({ users, authUsers });
});

userRouter.get('/profile', async (req, res) => {
  const { uuid } = req.payload;
  const user = await User.getByUUID(uuid);
  const authUser = await user.getAuthorizedUser();

  res.status(200).send({
    user: AuthorizedUser.toAuthJSON(authUser, user),
  });
});
userRouter.put('/profile', async (req, res) => {
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
});




userRouter.get('/hui', (req, res) => {
  res.status(200).send({
    message: 'private hui',
  });
});
authRouter.get('/hui', (req, res) => {
  res.status(200).send({
    message: 'public hui',
  });
});



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
      console.log(user);
      user.token = AuthorizedUser.generateJWT(user.authUserUUID, user.userUUID);

      return res.status(200).json({ user });
    }

    console.log(user);
    return next(res.status(400));
  })(req, res, next);
});
authRouter.post('/register', async (req, res, next) => {
  const data = req.body;

  try {
    const user = await User.create(data);
    data.UserId = user.id;
    const authUser = await AuthorizedUser.create(data);

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
