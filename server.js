import app from './app';

// const HOSTNAME = '127.0.0.1';
const PORT = '5000';

app.listen(PORT, err => {
  if (err) throw err;
  console.log('Люди-люди, хуи на блюди');
});
