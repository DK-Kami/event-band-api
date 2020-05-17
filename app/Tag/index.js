import Router from '../Base/Router';
import Tag from './Tag';

const tagRouter = new Router();
const anonimTagRouter = new Router();

/**
 * Функция для получения всех тегов
 */
async function getAllTagsRoute(req, res) {
  const tags = await Tag.getAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'uuid', 'name'],
  });
  res.status(200).send({ tags });
};

/**
 * Получене всез тегов для неавторизованного пользователя
 */
tagRouter.get('/all', getAllTagsRoute);
/**
 * Получене всез тегов для авторизованного пользователя
 */
anonimTagRouter.get('/all', getAllTagsRoute);

/**
 * Получене тега по его id
 */
tagRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.getById(id);
  res.status(200).send({ tag });
});

export {
  anonimTagRouter,
  tagRouter,
};
