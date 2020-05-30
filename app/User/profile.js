import Router from '../Base/Router';
import AuthorizedUser from './AuthorizedUser';
import User from './User';

const profileRouter = new Router();

/**
 * Возвращение профиля пользователя по токену
 */
profileRouter.get('/', async (req, res) => {
  const { uuid } = req.payload;
  const {
    organizations,
    subscriptions,
    message,
    user,
  } = await AuthorizedUser.getProfile(uuid);

  if (message) {
    return res.status(400).send({ message });
  }

  return res.status(200).send({
    user,
    organizations,
    subscriptions,
  });
});

/**
 * Редактирование профиля пользователя
 */
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

  const realUser = await User.getOne({
    where: { email },
  });
  if (realUser && realUser.uuid !== userUUID) {
    return res.status(400).send({
      message: 'email is already taken',
    });
  }

  try {
    await User.update(
      { surname, email, name },
      { uuid: userUUID },
    );
    await AuthorizedUser.update(
      { nickname },
      { uuid: authUserUUID },
    );

    const {
      organizations,
      subscriptions,
      message,
      user,
    } = await AuthorizedUser.getProfile(userUUID);

    if (message) {
      return res.status(400).send({ message });
    }

    return res.status(200).send({
      user,
      organizations,
      subscriptions,
    });
  } catch (message) {
    console.log(message);
    res.status(400).send({ message });
  }
});

export {
  profileRouter,
};
