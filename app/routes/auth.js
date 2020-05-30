const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  if (!req.headers) return null;
  const {
    token,
    authorization,
  } = req.headers;

  if (token && token.split(' ')[0] === 'Bearer') {
    return token.split(' ')[1];
  }
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    getToken: getTokenFromHeaders,
    userProperty: 'payload',
    secret: 'secret',
  }),
  optional: jwt({
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    userProperty: 'payload',
    secret: 'secret',
  }),
};

module.exports = auth;
