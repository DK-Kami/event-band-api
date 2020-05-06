import Model from '../Base/Model';
import models from '../../db/models';

const {
  AuthorizedUser: AuthorizedUserModel,
  User: UserModel,
} = models;

class User extends Model {
  constructor() {
    super(UserModel);
  }
};

export default User;
