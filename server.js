import express from 'express';
import https from 'https';
import http from 'http';
import app from './app';
import fs from 'fs';

const HTTPS_PORT = '5000';
const HTTP_PORT = '5001';
const privateKey = fs.readFileSync('ssl/ssl.key', 'utf8');
const certificate = fs.readFileSync('ssl/ssl.cert', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate
};

app.use(express.static(__dirname + '/public'));
const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);

httpsServer.listen(HTTPS_PORT, err => {
  if (err) throw err;
  console.log('Люди-люди, хуи на блюди');
});
httpServer.listen(HTTP_PORT, err => {
  if (err) throw err;
  console.log('Люди-люди, хуи на блюди, но на http');
});
