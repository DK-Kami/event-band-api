import soketIo from 'socket.io';
import jwt from 'jsonwebtoken';
import Chat from '../app/Chat/Chat/Chat';
import User from '../app/User/User';

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

  let authUser;
  let user;

  io.use((socket, next) => {
    const token = socket.handshake.headers.authorization;

    jwt.verify(token, 'secret', async (err, authorizedData) => {
      console.log(authorizedData);
      const {
        authUserUUID,
        userUUID,
      } = authorizedData;

      authUser = await User.getByUUID(authUserUUID);
      user = await User.getByUUID(userUUID);
      next();
    });
  });

  io.on('connection', async (socket) => {
    socket.emit('joined', {
      authUser,
      user,
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
