import https from 'https';
import http from 'http';
import fs from 'fs';
import app from './app';
import io from './io';

io(http);

const HTTPS_PORT = '5000';
const HTTP_PORT = '5001';
const privateKey = fs.readFileSync('ssl/ssl.key', 'utf8');
const certificate = fs.readFileSync('ssl/ssl.cert', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
};


const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpsServer.listen(HTTPS_PORT, err => {
  if (err) throw err;
  console.log('Запуск сервера');
});
httpServer.listen(HTTP_PORT, err => {
  if (err) throw err;
  console.log('Запуск сервера, но на http');
});
