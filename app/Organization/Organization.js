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

  async loginAsOrganization(userUUID, organizationUUID) {
    return jwt.sign({
      organizationUUID,
      userUUID,
    }, 'secret');
  }
};

export default new Organization();
