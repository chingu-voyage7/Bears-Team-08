const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const models = require('../models');

const { User } = models;

// POST route to register a user
router.post('/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body; //  eslint-disable-line
  const user = new User({
    email,
    password,
    confirmed: false,
    products: [],
    firstName,
    lastName,
  });
  user.save(err => {
    if (err) {
      console.log(err);
      res.status(500).send('Error registering new user please try again.');
    } else {
      res.status(200).send('Welcome to the club!');
    }
  });
});

router.post('/signin', (req, res) => {
  const secret = 'shhh';
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).json({
        error: 'Internal error please try again',
      });
    } else if (!user) {
      res.status(401).json({
        error: 'Incorrect email or password',
      });
    } else {
      user.isCorrectPassword(password, (e, same) => {
        if (e) {
          res.status(500).json({
            error: 'Internal error please try again',
          });
        } else if (!same) {
          res.status(401).json({
            error: 'Incorrect email or password',
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h',
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;
