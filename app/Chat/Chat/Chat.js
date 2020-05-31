import Model from '../../Base/Model';
import models from '../../../db/models';

const {
  Chat: ChatModel,
} = models;

class Chat extends Model {
  constructor() {
    super(ChatModel);
  }
}

export default new Chat();
