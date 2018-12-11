const express = require('express');
const authRouter = require('./auth');
const imageRouter = require('./images');

const itemRouter = require('./item-router');

const router = express.Router();

router.use('/auth', authRouter);
router.use(itemRouter);
router.use('/images', imageRouter);

module.exports = router;
