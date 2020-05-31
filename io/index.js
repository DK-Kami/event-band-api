import gravatar from 'gravatar';
import soketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../app/User/User';
import AuthorizedUser from '../app/User/AuthorizedUser';
import ChatMessage from '../app/Chat/ChatMessage/ChatMessage';

const getConnectionsCount = io => Object(io.sockets.connected).length;

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

  let currentUser;

  io.use((socket, next) => {
    const token = socket.handshake.headers.authorization;
    if (!token) next();

    jwt.verify(token, 'secret', async (err, authorizedData) => {
      const {
        authUserUUID,
        userUUID,
      } = authorizedData;

      const authUser = await AuthorizedUser.getByUUID(authUserUUID);
      const user = await User.getByUUID(userUUID);

      currentUser = {
        authUuid: authUserUUID,
        userUuid: userUUID,
        email: user.email,
        nickname: authUser.nickname,
        avatar: gravatar.url(user.email, { s: 200 }),
      };
      next();
    });
  });

  io.on('connection', async (socket) => {
    if (!currentUser) return;

    socket.broadcast.emit('joined', {
      connections: getConnectionsCount(io),
      user: currentUser,
    });

    socket.emit('connections', getConnectionsCount(io));

    socket.on('send', async (message) => {
      // const chatMessage = await ChatMessage.create({
      //   message,
      // })
    });

    socket.on('disconnect', async () => {
      io.sockets.emit('user-leave', {
        connections: getConnectionsCount(io),
        user: currentUser,
      });
    });
  });
};
