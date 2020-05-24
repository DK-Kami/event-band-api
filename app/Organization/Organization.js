import Model from '../Base/Model';
import models from '../../db/models';
import jwt from 'jsonwebtoken';
const {
  Organization: OrganizationModel,
} = models;

class Organization extends Model {
  constructor() {
    super(OrganizationModel);
  }

  /**
   * Функция, генерирующая токен для доступа к роутам организации
   * @param {Object} loginData Данные для авторизации под организацией
   * @param {Object} loginData.organizationUUID uuid организации
   * @param {Object} loginData.userUUID uuid пользователя 
   */
  loginAsOrganization({ organizationUUID, userUUID }) {
    return jwt.sign({
      organizationUUID,
      userUUID,
    }, 'secret');
  }
};

export default new Organization();
