const mainRouter = require('../Base/Router')();

mainRouter.use('/api',  require('./privateRouter'));
mainRouter.use('/',     require('./publicRouter'));

mainRouter.use('*', (req, res) => {
  res.status(500).send({
    message: 'method not implemented',
  });
});

export default mainRouter;
