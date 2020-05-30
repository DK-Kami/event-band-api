import Model from '../Base/Model';
import models from '../../db/models';

const {
  Subscriber: SubscriberModel,
} = models;

class Subscriber extends Model {
  constructor() {
    super(SubscriberModel);
  }
}

export default new Subscriber();
