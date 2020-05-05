import Users from '../controllers/user';
import AuthorizedUser from '../controllers/authorizedUser';

export default (app) => {
  app.get('/api',
    (req, res) => res.status(200).send({ message: 'Welcome to the huita API!', })
  );
  app.get('/api/users', Users.getAll);
  app.get('/api/users/:id', Users.getCurrent);
  
  // API route for user to signup
};
