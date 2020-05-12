import Model from '../Base/Model';
import models from '../../db/models';
const {
  Event: EventModel,
} = models;

class Event extends Model {
  constructor() {
    super(EventModel);
  }
};

export default new Event();
