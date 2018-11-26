const express = require('express');
const authRouter = require('./auth');
const withAuth = require('../utils/middleware');

const router = express.Router();

router.get('/home', (req, res) => {
  res.send('Welcome!');
});

router.get('/secret', withAuth, (req, res) => {
  res.send('The password is potato');
});

router.use('/auth', authRouter);

module.exports = router;
