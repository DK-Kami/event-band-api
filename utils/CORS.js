const currentUrl = process.env.NODE_ENV === 'production'
    ? 'https://event-band-api.ru'
    : 'http://localhost:8080';

/**
 * Функция решающая проблему с CORS политикой, посредством установления заголовков
 * @param {Object} res Объект запроса
 */
function fixCors(res) {
  res.header('Access-Control-Allow-Origin', currentUrl);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
}

export {
  fixCors,
};
