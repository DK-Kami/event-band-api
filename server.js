const app = require('./app');

app.init();
app.listen(utils.PORT, err => {
  if (err) throw err;
});
