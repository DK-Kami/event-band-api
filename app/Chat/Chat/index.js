import gravatar from 'gravatar';
import Router from '../../Base/Router';
import models from '../../../db/models';
import Chat from './Chat';

const {
  AuthorizedUser: AuthorizedUserModel,
  ChatMessage: ChatMessageModel,
  User: UserModel,
} = models;
const chatRouter = new Router();

/**
 * [DEBUG] Получение всех чатов
 */
chatRouter.get('/all', async (req, res) => {
  const chats = await Chat.getAll({
    include: {
      model: ChatMessageModel,
      include: [
        { model: UserModel },
      ],
    },
  });

  return res.status(200).send({ chats });
});

/**
 * Получение сообщений конкретного чата
 */
chatRouter.get('/:uuid', async (req, res) => {
  const { userUUID } = req.payload;
  const { uuid } = req.params;

  const chat = await Chat.getByUUID(uuid);
  if (!chat) {
    return res.status(404).send({
      message: 'chat not found',
    });
  }

  const messages = await chat.getChatMessages({
    attributes: ['uuid', 'message', 'createdAt'],
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: UserModel,
        attributes: ['email', 'uuid'],
        include: {
          model: AuthorizedUserModel,
          attributes: ['nickname'],
        },
      },
    ],
  });

  return res.status(200).send({
    messages: messages.map(message => ({
      uuid: message.uuid,
      message: message.message,
      createdAt: message.createdAt,
      user: {
        isOwn: message.User.uuid === userUUID,
        email: message.User.email,
        nickname: message.User.AuthorizedUser.nickname,
        avatar: gravatar.url(message.User.email, { s: 200 }),
      },
    })),
  });
});

export {
  chatRouter,
};
