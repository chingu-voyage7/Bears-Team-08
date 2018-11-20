const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Bears 08 Home Page');
});

module.exports = router;
