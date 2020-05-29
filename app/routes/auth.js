const jwt = require('express-jwt');

let oldToken;

const getTokenFromHeaders = (req) => {
  if (!req.headers) return null;
  
  console.log('--------------------------------------------------------------------------------------------------------------------------------');
  console.log('getTokenFromHeaders req.headers', req.headers);
  console.log('getTokenFromHeaders req.headers.token', req.headers.token);
  console.log('getTokenFromHeaders req.headers.organization', req.headers.organization);
  console.log('getTokenFromHeaders req.headers.authorization', req.headers.authorization);
  console.log('getTokenFromHeaders old authorization', oldToken);
  oldToken = req.headers.authorization;
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