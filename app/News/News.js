import Model from '../Base/Model';
import models from '../../db/models';

const {
  News: NewsModel,
} = models;

class News extends Model {
  constructor() {
    super(NewsModel);
  }
}

export default new News();
