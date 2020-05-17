import Router from '../Base/Router';
import Tag from './Tag';

const tagRouter = new Router();
const anonimTagRouter = new Router();

async function getAllTagsRoute(req, res) {
  const tags = await Tag.getAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'uuid', 'name'],
  });
  res.status(200).send({ tags });
};

tagRouter.get('/all', getAllTagsRoute);
anonimTagRouter.get('/all', getAllTagsRoute);

tagRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.getById(id);
  res.status(200).send({ tag });
});

export {
  anonimTagRouter,
  tagRouter,
};
