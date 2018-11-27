const express = require('express');
const authRouter = require('./auth');
const withAuth = require('../utils/middleware');

const itemRouter = require('./item-router');

const router = express.Router();

router.use('/auth', authRouter);
router.use(itemRouter);

router.get('/home', (req, res) => {
  res.send('Welcome!');
});

router.get('/secret', withAuth, (req, res) => {
  res.send('The password is potato');
});


module.exports = router;
