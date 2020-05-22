import express from 'express';
import https from 'https';
import app from './app';
import fs from 'fs';

const PORT = '5000';
const privateKey = fs.readFileSync('ssl/ssl.key', 'utf8');
const certificate = fs.readFileSync('ssl/ssl.cert', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate
};

app.use(express.static(__dirname + '/public'));
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, err => {
  if (err) throw err;
  console.log('Люди-люди, хуи на блюди');
});
