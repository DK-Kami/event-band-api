import passport from 'passport';
import Router from '../Base/Router';
import auth from '../routes/auth';
import AuthorizedUser from './AuthorizedUser';
import User from './User';

const userRouter = new Router();
const authRouter = new Router();

userRouter.get('/', async (req, res) => { 
  const users = await User.getAll();
  return res.status(200).send({ users });
});

userRouter.get('/profile', async (req, res) => {
  auth.verifyToken(req, (err, user) => {
    if (err) {
      return res.status(401).send({
        message: 'Incorrect token',
      });
    }

    console.log(user);
    res.status(200).send({
      message: 'hui pososeh, ok?)',
    });
  });
});


userRouter.get('/hui', (req, res) => {
  res.status(200).send('private hui');
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
      return res.status(400).send(err);
    }

    if(user) {
      console.log(user);
      user.token = AuthorizedUser.generateJWT(user.email, user.uuid);

      return res.status(200).json({ user });
    }

    return next(res.status(400));
  })(req, res, next);
});
authRouter.post('/register', async (req, res, next) => {
  const data = req.body;

  try {
    const user = await User.create(data);
    const authUser = await AuthorizedUser.create(data);

    res.status(201).send({
      user: AuthorizedUser.toAuthJSON(authUser, user),
    });
  }
  catch(message) {
    console.log(message);
    res.status(400).send({ message });
  }

  // try {
    // const user = await User.create(data);
    // console.log('user', user);
    // res.status(201).send({ user });
  //   const authUser = await AuthorizedUser.create(data);

  //   res.status(201).send({
  //     user: AuthorizedUser.toAuthJSON(authUser, user),
  //   });
  // }
  // catch(e) {
  //   console.log(e);
  //   res.status(400).send(e);
  //   const { constraint, routine } = e.parent;
  //   console.error(e);
  //   console.log(constraint, routine);

  //   let message = '';
  //   switch (routine) {
  //     case '_bt_check_unique':
  //       message = 'Email is already taken';
  //       break;
  //   }

  //   res.status(400).send({ message });
  // }
});

export {
  userRouter,
  authRouter,
};
