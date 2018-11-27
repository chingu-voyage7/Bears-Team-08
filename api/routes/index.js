const express = require('express');
const authRouter = require('./auth');

const itemRouter = require('./item-router');

const router = express.Router();

router.use('/auth', authRouter);
router.use(itemRouter);

module.exports = router;
