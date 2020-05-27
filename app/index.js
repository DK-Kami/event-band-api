// import "babel-core/register";
// import "babel-polyfill";

import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import path from 'path';
import cors from 'cors';
import '../utils/passport';

const appDir = path.dirname(require.main.filename);
const app = express();

app.use('/static', express.static(appDir + '/public'));

// const allowCrossDomain = (req, res, next) => {
//   const currentUrl = process.env.NODE_ENV === 'production'
//     ? 'https://event-band-api.ru'
//     : 'http://localhost:8080';

//   res.header('Access-Control-Allow-Origin', currentUrl);
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");

//   next();
// };
// app.use(allowCrossDomain);

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

export default app;
