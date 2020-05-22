// import http from 'http';
// import app from './app';

const http = require('http');

// const HOSTNAME = '127.0.0.1';
const PORT = '8080';

console.log(process.env.NODE_ENV);
const server = http.createServer();
server.listen('80', () => {
  console.log('hui');
})
// app.listen(PORT, err => {
//   if (err) throw err;
//   console.log('Люди-люди, хуи на блюди');
// });
