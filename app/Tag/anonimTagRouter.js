import Router from '../Base/Router';
import Tag from './Tag';

const anonimTagRouter = new Router();

/**
 * Получение всез тегов для неавторизованного пользователя
 */
anonimTagRouter.get('/all', Tag.getAllTagsRoute);
/**
 * Получение тега по его id для неавторизованного пользователя
 */
anonimTagRouter.get('/:uuid', Tag.getTagByUUID);

export {
  anonimTagRouter,
};
