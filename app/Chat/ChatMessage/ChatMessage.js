import Model from '../../Base/Model';
import models from '../../../db/models';

const {
  ChatMessage: ChatMessageModel,
} = models;

class ChatMessage extends Model {
  constructor() {
    super(ChatMessageModel);
  }
}

export default new ChatMessage();
