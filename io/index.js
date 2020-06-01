import gravatar from 'gravatar';
import soketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../app/User/User';
import AuthorizedUser from '../app/User/AuthorizedUser';
import ChatMessage from '../app/Chat/ChatMessage/ChatMessage';
import Chat from '../app/Chat/Chat/Chat';

/**
 * Получение количества текущих соединений
 * @param {io} io Экземляр iо
 */
const getConnectionsCount = io => Object.keys(io.sockets.connected).length;
/**
 * Возвращение данных текущего пользователя по его сокету
 * @param {Socket} socket текущий сокет
 * @param {Function} done функция обратного вызова
 */
async function getCurrentUser(socket, done) {
  const token = socket.handshake.headers.authorization;
  if (!token) {
    return done({ error: 'token not found' });
  }

  const { chatUuid } = socket.handshake.query;
  const chat = await Chat.getByUUID(chatUuid);
  if (!chat) {
    return done({ error: 'chat not found' });
  }

  jwt.verify(token, 'secret', async (err, authorizedData) => {
    const {
      authUserUUID,
      userUUID,
    } = authorizedData;

    const authUser = await AuthorizedUser.getByUUID(authUserUUID);
    const user = await User.getByUUID(userUUID);
    const UserId = user.id;

    const currentUser = {
      authUuid: authUserUUID,
      userUuid: userUUID,
      email: user.email,
      nickname: authUser.nickname,
      avatar: gravatar.url(user.email, { s: 200 }),
    };

    return done(null, {
      currentUser,
      UserId,
      chat,
    });
  });
}

export default server => {
  const io = soketIo(server, {
    handlePreflightRequest: (req, res) => {
      const currentUrl = process.env.NODE_ENV === 'production'
        ? 'https://event-band-api.ru'
        : 'http://localhost:8080';

      const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': currentUrl,
        'Access-Control-Allow-Credentials': true,
      };
      res.writeHead(200, headers);
      res.end();
    },
  });

  /**
   * Подключение к текущему сокету
   */
  io.on('connection', async (socket) => {
    await getCurrentUser(socket, (error, { chat, currentUser, UserId }) => {
      if (error) {
        return socket.emit('error', error);
      }

      /**
       * Отправка события подключения пользователя
       */
      socket.broadcast.emit('joined', {
        connections: getConnectionsCount(io),
        user: currentUser,
      });

      /**
       * Отправка события изменения числа подключений
       */
      socket.emit('connections', getConnectionsCount(io));

      /**
       * Прослушивание события отправки сообщения
       */
      socket.on('send', async (message) => {
        console.log('message', message, UserId, chat.id);
        await ChatMessage.create({
          ChatId: chat.id,
          message,
          UserId,
        });

        console.log('inbox', {
          ...currentUser,
          createdAt: new Date(),
          isOwn: false,
        }, message);

        socket.broadcast.emit('inbox', {
          user: {
            ...currentUser,
            createdAt: new Date(),
            isOwn: false,
          },
          message,
        });
      });

      /**
       * Прослушивание события выхода из чата
       */
      socket.on('leave-chat', async () => {
        socket.disconnect(true);

        io.sockets.emit('connections', getConnectionsCount(io));
        io.sockets.emit('user-leave', {
          connections: getConnectionsCount(io),
          user: currentUser,
        });
      });
    });
  });
};
