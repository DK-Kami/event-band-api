import models from '../../db/models';
import Model from '../Base/Model';

const {
  Tag: TagModel,
} = models;

class Tag extends Model {
  constructor() {
    super(TagModel);
  }
};

export default new Tag();
