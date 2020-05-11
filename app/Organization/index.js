import Organization from './Organization';
import Router from '../Base/Router';

const organizationRouter = new Router();

organizationRouter.get('/all', async (req, res) => {
  const organizations = await Organization.getAll();
  return res.status(200).send({ organizations });
});

export {
  organizationRouter,
};
