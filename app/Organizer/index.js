import Organizer from './Organizer';
import Router from '../Base/Router';

const organizerRouter = new Router();

organizerRouter.get('/all', async (req, res) => {
  const organizers = await Organizer.getAll();
  return res.status(200).send({ organizers });
});

export {
  organizerRouter,
};
