import Router from '../Base/Router';
import News from './News';
import models from '../../db/models';

const {
  Organization: OrganizationModel,
  User: UserModel,
} = models;
const newsRouter = new Router();

/**
 * [DEBUG] Путь для получение всех записей
 */
newsRouter.get('/all', async (req, res) => {
  const news = await News.getAll({
    attributes: ['id', 'uuid', 'title', 'text', 'image'],
    include: [
      { model: OrganizationModel },
      { model: UserModel },
    ],
  });
  res.status(200).send({ news });
});

export {
  newsRouter,
};
