import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import crypto from 'crypto';
import Model from '../Base/Model';
import models from '../../db/models';

const {
  AuthorizedUser: AuthorizedUserModel,
} = models;

class AuthorizedUser extends Model {
  constructor() {
    super(AuthorizedUserModel);
  }

  async create(data) {
    data.salt = crypto.randomBytes(16).toString('hex');
    data.password = this.cryptoPassword(data.password, data.salt);
    const authUser = await this.Model.create(data);
    return authUser;
  }

  cryptoPassword(password, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return hash;
  }

  generateJWT(email, uuid) {
    return jwt.sign({
      email,
      uuid,
    }, 'secret');
  }
  toAuthJSON(authUser, user) {
    const avatar = gravatar.url(user.email, { s: 200 });

    return {
      uuid: user.uuid,
      nickname: authUser.nickname,
      token: authUser.token,
      surname: user.surname,
      email: user.email,
      name: user.name,
      avatar,
    };
  }
};

export default new AuthorizedUser();
