import models from '../../db/models';
import Model from '../Base/Model';

const {
  Tag: TagModel,
} = models;

class Tag extends Model {
  constructor() {
    super(TagModel);
  }
}

const tagModel = new Tag();

/**
 * Функция для получения всех тегов
 */
tagModel.getAllTagsRoute = (req, res) => {
  tagModel.getAll({
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
tagModel.getTagByUUID = async (req, res) => {
  const { uuid } = req.params;

  const tag = await tagModel.getByUUID(uuid);
  if (!tag) {
    return res.status(404).send({
      message: 'tag not found',
    });
  }

  return res.status(200).send({ tag });
};

export default tagModel;
