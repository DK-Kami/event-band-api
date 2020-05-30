import publicRouter from './publicRouter';
import privateRouter from './privateRouter';
import Router from '../Base/Router';
import auth from './auth';
const mainRouter = new Router();

mainRouter.get('/ping', (req, res) => {
  res.status(200).send({
    message: 'all ok',
  });
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
