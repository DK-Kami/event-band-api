import Router from '../Base/Router';
import Tag from './Tag';

const tagRouter = new Router();

/**
 * Получение всез тегов для авторизованного пользователя
 */
tagRouter.get('/all', Tag.getAllTagsRoute);
/**
 * Получение тега по его id для авторизованного пользователя
 */
tagRouter.get('/:uuid', Tag.getTagByUUID);

export {
  tagRouter,
};
