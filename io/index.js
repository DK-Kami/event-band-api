import soketIo from 'socket.io';

export default http => {
  const io = soketIo(http);
  io.on('connection', socket => {
    console.log('connection', socket);

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
