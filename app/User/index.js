import router from '../Base/Router';
import User from './User';

router.use('/', async (req, res) => {
  const users = await User.getAll();
  return res.status(200).send({ users });
});

export default router;
