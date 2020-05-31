import soketIo from 'socket.io';
import jwt from 'express-jwt';
import Chat from '../app/Chat/Chat/Chat';
import User from '../app/User/User';

export default http => {
  const io = soketIo(http);
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
