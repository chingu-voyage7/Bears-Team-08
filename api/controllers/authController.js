const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const models = require('../models');
const db = require('../../database');

const { User } = models;

const AuthController = {};

AuthController.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body; //  eslint-disable-line
  const user = new User({
    email,
    password,
    confirmed: false,
    products: [],
    firstName,
    lastName,
    confirmationToken: '',
  });
  await user.save(err => {
    if (err) {
      console.log(err);
      res.status(500).send('Error registering new user please try again.');
    } else {
      res.status(200).send('Welcome to the club!');
    }
  });
};

AuthController.signin = async (req, res) => {
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
};

AuthController.confirmEmail = async req => {
  const {
    body: { email },
  } = req;

  const secret = 'shhh';
  const info = {};
  info.email = email;
  info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  const token = jwt.sign(info, secret);

  await db
    .collection('users')
    .findOneAndUpdate(
      { email },
      { $set: { confirmationToken: token } },
      (err, doc) => {
        if (err) {
          console.log('Something wrong when updating data!');
        }

        console.log(doc);
      },
    );

  const mailOptions = {
    from: 'noreply@bearsteam08@gmail.com',
    to: email,
    subject: 'Confirm account Chingu Bears-08',
    text: `You are receiving this because you (or someone else) have registered on our site (thanks for helping us out!) \n\n Please click on the following link, or paste this into your browser to complete the process \n\n http://localhost:3000/success-email/${token}`,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SERVICE_EMAIL,
      pass: process.env.SERVICE_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, err => {
    if (err) console.error(err);
    console.log('Confirmation email sent');
  });
};

AuthController.resetPassword = async req => {
  const {
    body: { email },
  } = req;
  const secret = 'shhh';
  const info = {};
  info.email = email;
  info.expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  const token = jwt.sign(info, secret);

  const mailOptions = {
    from: 'noreply@bearsteam08@gmail.com',
    to: 'lucwsomers@gmail.com',
    subject: 'Reset Password Chingu Bears-08',
    text: `You are receiving this because you (or someone else) have requested a password reset on our site \n\n Please click on the following link, or paste this into your browser to complete the process \n\n http://localhost:3000/change-password/${token}`,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SERVICE_EMAIL,
      pass: process.env.SERVICE_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) console.error(err);
    response.status(200).json('Confirmation email sent');
  });
};

module.exports = AuthController;
