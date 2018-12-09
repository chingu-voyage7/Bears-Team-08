const express = require('express');
const controllers = require('../controllers');
const middleware = require('./middleware');

const { itemController } = controllers;
const { ensureLogin } = middleware;

const itemRouter = express.Router();

const loginPath = '/api/auth/signin';


// ROUTES

itemRouter.get('/items/:item', itemController.readOne);

itemRouter.route('/items')

  .get(itemController.read)

  .post(ensureLogin(loginPath), itemController.create)

  .put(ensureLogin(loginPath), itemController.update)

  .delete(ensureLogin(loginPath), itemController.remove);


module.exports = itemRouter;
