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
/**
 * Приватные пути API
 */
mainRouter.use('/api', auth.required, privateRouter);
/**
 * Публичные пути API
 */
mainRouter.use('/', auth.optional, publicRouter);

/**
 * Обработка отсутствующего пути
 */
mainRouter.use('*', (req, res, next) => {
  res.status(500).send({
    message: 'method not implemented',
  });
  return next();
});

export default mainRouter;
