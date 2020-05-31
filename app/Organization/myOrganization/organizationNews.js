import Router from '../../Base/Router';
import News from '../../News/News';
import models from '../../../db/models';
import { getOrganization } from '../../../utils/myOrganization';

const organizationNews = new Router();
const {
  User: UserModel,
} = models;

/**
 * Получение всех новостей организации
 */
organizationNews.get('/all', async (req, res) => {
  await getOrganization(req, res);

  const {
    organization: {
      id: OrganizationId,
    },
  } = req.payload;

  const news = await News.getAll({
    where: { OrganizationId },
    include: [
      { model: UserModel },
    ],
  });

  return res.status(200).send({ news });
});

/**
 * Создание новости организации
 */
organizationNews.post('/create', async (req, res) => {
  await getOrganization(req, res);

  const {
    organization: {
      id: OrganizationId,
    },
    user: {
      id: UserId,
    },
  } = req.payload;
  const {
    title,
    text,
    image,
  } = req.body;

  if (!title) {
    return res.status(400).send({
      message: 'title must be not empty',
    });
  }

  News.create(
    {
      title, text, image, OrganizationId, UserId,
    },
    (message, news) => {
      if (message) {
        return res.status(400).send({ message });
      }

      return res.status(200).send({ news });
    },
  );
});

/**
 * Удаление новости организации по его uuid
 */
organizationNews.delete('/:uuid', async (req, res) => {
  await getOrganization(req, res);

  const { uuid } = req.params;
  const news = await News.getByUUID(uuid);
  if (!news) {
    return res.status(404).send({
      message: 'news not found',
    });
  }

  News.delete(uuid, message => {
    if (message) {
      return res.status(400).send({ message });
    }

    return res.status(200).send({
      message: 'all ok',
    });
  });
});

export {
  organizationNews,
};
