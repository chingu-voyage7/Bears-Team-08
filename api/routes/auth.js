const express = require('express');
const controllers = require('../controllers');

const { AuthController } = controllers;

const router = express.Router();

// POST route to register a user
router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/signin', (req, res) => AuthController.signin(req, res));
router.post('/email-confirmation', req => AuthController.confirmEmail(req));
router.post('/reset-password', (req, res) =>
  AuthController.resetPassword(req, res),
);
router.post('/email-token-confirmation', (req, res) =>
  AuthController.confirmEmailToken(req, res),
);
router.post('/change-password', (req, res) =>
  AuthController.changePassword(req, res),
);

module.exports = router;
