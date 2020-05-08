import passport from 'passport';
import Router from '../Base/Router';
import AuthorizedUser from './AuthorizedUser';
import User from './User';

const userRouter = new Router();
const authRouter = new Router();

userRouter.get('/', async (req, res) => {
  console.log('waaat');
  const users = await User.getAll();
  return res.status(200).send({ users });
});


userRouter.get('/hui', (req, res) => {
  res.status(200).send('private hui');
});

authRouter.get('/hui', async (req, res) => {
  // console.log('public hui');
  // res.status(200).send('public hui');

  const users = await User.getOne({
    where: { email: 'suka@blyat.com' },
  });
  return res.status(200).send({ users });
});


authRouter.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

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
    if(err) {
      console.log('error', err);
      return res.status(401).send(err);
    }

    if(user) {
      console.log(user);
      user.token = AuthorizedUser.generateJWT(user.email, user.uuid);

      return res.status(200).json({ user });
    }

    return next(res.status(401));
  })(req, res, next);
});

export {
  userRouter,
  authRouter,
};
