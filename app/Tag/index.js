import Router from '../Base/Router';
import Tag from './Tag';

const tagRouter = new Router();

tagRouter.get('/all', async (req, res) => {
  const tags = await Tag.getAll();
  res.status(200).send({ tags });
});

tagRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.getById(id);
  res.status(200).send({ tag });
});

export {
  tagRouter,
};
