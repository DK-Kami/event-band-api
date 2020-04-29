const bodyParser = require('body-parser');
const express = require('express');

const logging = require('../logs');
const utils = require('../utils');

const router = require('./Base/Router');
const app = express();

app.init = () => global.utils = utils;

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);
app.use(logging);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('/public'));

app.use((req, res, next) => {
  res.status(500);

  res.json({
    error: 'not found current method',
  });
});

module.exports = app;
