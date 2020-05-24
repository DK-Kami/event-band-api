import Router from "../../Base/Router";
import News from '../../News/News';
import models from '../../../db/models';

const organizationNews = new Router();
const {
  User: UserModel,
} = models;

organizationNews.get('/all', async (req, res) => {
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

export {
  organizationNews,
};
