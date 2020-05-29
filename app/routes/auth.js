const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  if (!req.headers) return null;

  console.log('getTokenFromHeaders req.headers', req.headers);
  const {
    organization,
    authorization,
  } = req.headers;

  if (organization && organization.split(' ')[0] === 'Bearer') {
    return organization.split(' ')[1];
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