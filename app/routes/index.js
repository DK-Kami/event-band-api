import publicRouter from './publicRouter';
import privateRouter from './privateRouter';
import Router from '../Base/Router';
import auth from './auth';
import { fixCors } from '../../utils/CORS';
const mainRouter = new Router();

mainRouter.use((req, res, next) => {
  fixCors(res);
  next();
});

mainRouter.use('/api', auth.required, privateRouter);
mainRouter.use('/', auth.optional, publicRouter);

mainRouter.use('*', (req, res, next) => {
  console.log(publicRouter);
  res.status(500).send({
    message: 'method not implemented',
  });
  next();
});

export default mainRouter;
