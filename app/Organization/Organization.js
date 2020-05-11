import Model from '../Base/Model';
import models from '../../db/models';
const {
  Organization: OrganizationModel,
} = models;

class Organization extends Model {
  constructor() {
    super(OrganizationModel);
  }
}

export default new Organization();
