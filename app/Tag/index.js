import Router from '../Base/Router';
import Tag from './Tag';

const tagRouter = new Router();
const anonimTagRouter = new Router();

/**
 * Функция для получения всех тегов
 */
function getAllTagsRoute(req, res) {
  Tag.getAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'uuid', 'name'],
  }, (message, tags) => {
    if (message) {
      return res.status(400).send({ message });
    }

    return res.status(200).send({ tags });
  });
};
/**
 * Функция для полкчения тега по его uuid
 */
async function getTagByUUID(req, res) {
  const { uuid } = req.params;

  const tag = await Tag.getByUUID(uuid);
  return res.status(200).send({ tag });
};


/**
 * Получение всез тегов для неавторизованного пользователя
 */
anonimTagRouter.get('/all', getAllTagsRoute);
/**
 * Получение тега по его id для неавторизованного пользователя
 */
anonimTagRouter.get('/:uuid', getTagByUUID);

/**
 * Получение всез тегов для авторизованного пользователя
 */
tagRouter.get('/all', getAllTagsRoute);
/**
 * Получение тега по его id для авторизованного пользователя
 */
tagRouter.get('/:uuid', getTagByUUID);

export {
  anonimTagRouter,
  tagRouter,
};
