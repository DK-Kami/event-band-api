import soketIo from 'socket.io';
import Chat from '../app/Chat/Chat/Chat';

export default http => {
  const io = soketIo(http);
  io.on('connection', async (socket, data) => {
    console.log('connection', socket, data);

    const chats = Chat.getAll();
    socket.emit('huivrot', { chats });
    socket.emit('soisipisos', (message) => message);

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
