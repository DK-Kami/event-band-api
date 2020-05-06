import mainRouter from '../Base/Router';
import publicRouter from './publicRouter';
import privateRouter from './privateRouter';

mainRouter.use('/api', privateRouter);
mainRouter.use('/', publicRouter);

mainRouter.use('*', (req, res) => {
  res.status(500).send({
    message: 'method not implemented',
  });
});

export default mainRouter;
