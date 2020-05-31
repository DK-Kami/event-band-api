import Model from '../../Base/Model';
import models from '../../../db/models';

const {
  ChatUser: ChatUserModel,
} = models;

class ChatUser extends Model {
  constructor() {
    super(ChatUserModel);
  }
}

export default new ChatUser();
