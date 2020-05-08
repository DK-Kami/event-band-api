import models from '../../db/models';
import Model from '../Base/Model';

const {
  User: UserModel,
} = models;

class User extends Model {
  constructor() {
    super(UserModel);
  }
};

export default new User();
