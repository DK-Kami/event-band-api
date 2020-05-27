// import "babel-core/register";
// import "babel-polyfill";

import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import path from 'path';
import '../utils/passport';
import { fixCors } from '../utils/CORS';

const appDir = path.dirname(require.main.filename);
const app = express();

app.use('/static', express.static(appDir + '/public'));
app.use((req, res, next) => {
  fixCors(res);
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

export default app;
