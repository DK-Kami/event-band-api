const router = require('../Base/Router');

router.get('/', (req, res) => {
  console.log(res);

  InfoType.find({}, (err, types) => {
    if (err) throw err;
    res.send(types);
  });
});
