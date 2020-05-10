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

profileRouter.get('/request-password', async (req, res) => {
  const { email } = req.params;
  const authUser = await AuthorizedUser.getByUUID(authUserUUID);

  s
  res.status(200).send({
    message: 'all ok',
  });
});

export {
  profileRouter,
  passwordRouter,
};
