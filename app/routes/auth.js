const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const { authorization } = req.headers;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
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