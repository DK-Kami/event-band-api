import app from './app';

// const HOSTNAME = '127.0.0.1';
const PORT = '8080';

app.listen(PORT, err => {
  if (err) throw err;
  console.log('Люди-люди, хуи на блюди');
});
