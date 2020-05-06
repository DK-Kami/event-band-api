import User from '../User';
const router = require('../Base/Router')();

router.use('/', async (req, res) => {
  const users = await User.getAll;
  return res.status(200).send({ users });
});

export default router;
