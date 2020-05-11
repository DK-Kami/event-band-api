import Model from '../Base/Model';
import models from '../../db/models';
const {
  Organizer: OrganizerModel,
} = models;

class Organizer extends Model {
  constructor() {
    super(OrganizerModel);
  }
}

export default new Organizer();
