import Model from '../Base/Model';
import models from '../../db/models';

const {
  EventTag: EventTagModel,
} = models;

class EventTag extends Model {
  constructor() {
    super(EventTagModel);
  }
}

export default new EventTag();
