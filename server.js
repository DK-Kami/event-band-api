const app = require('./app');

app.init();
app.listen(confug.PORT, err => {
  if (err) throw err;
  // app.connectToDB();
});
