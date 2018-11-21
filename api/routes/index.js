const express = require('express');

const router = express.Router();

router.get('/index', (req, res) => {
  res.send('Bears 08 Home Page');
});

router.use('/api', require('./api'));

module.exports = router;
