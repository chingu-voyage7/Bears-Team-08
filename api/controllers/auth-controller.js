const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const models = require('../models');
const passport = require('passport');
const db = require('../../database');

const { User } = models;

const AuthController = {};

AuthController.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body //  eslint-disable-line
  const user = new User({
    email,
    password,
    confirmed: false,
    products: [],
    firstName,
    lastName,
    confirmationToken: '',
    confirmationPasswordToken: '',
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

AuthController.signin = async (req, res, next) => {
  const secret = 'shhh';
  const { email, password } = req.body;

  // Luc's previous strategy:

  // User.findOne({ email }, (err, user) => {
  //   if (err) {
  //     res.status(500).json({
  //       error: 'Internal error please try again',
  //     });
  //   } else if (!user) {
  //     res.status(401).json({
  //       error: 'Incorrect email or password',
  //     });
  //   } else {
  //     user.isCorrectPassword(password, (e, same) => {
  //       if (e) {
  //         res.status(500).json({
  //           error: 'Internal error please try again',
  //         });
  //       } else if (!same) {
  //         res.status(401).json({
  //           error: 'Incorrect email or password',
  //         });
  //       } else {
  //         // Issue token
  //         const payload = { email };
  //         // Could we change it to this?
  //         // const payload = { id: user._id };
  //         const token = jwt.sign(payload, secret, {
  //           expiresIn: '10h',
  //         });
  //         res.cookie('token', token, { httpOnly: true }).sendStatus(200);
  //       }
  //     });
  //   }
  // });

  // Using passport to authenticate
  // (Luc's strategy above moved to passport localStrategy in config/passport.js)
  passport.authenticate('local', (error, user, info) => {

    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)

    if (error) {
      return res.status(500).json({
        error: 'Internal error please try again',
      });
    }

    req.login(user, (error) => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)

      if (error) {
        return res.status(500).json({
          error: 'Internal error please try again',
        });
      }

      // Issue token
      // const payload = { email };
      // Changed the payload to user._id to avoid exposing email
      const payload = { id: user._id };
      const token = jwt.sign(payload, secret, {
        expiresIn: '10h',
      });
      return res.cookie('token', token, { httpOnly: true }).sendStatus(200);

    });
  })(req, res, next);

};

AuthController.confirmEmailToken = async (req, res) => {
  const {
    body: { email, token },
  } = req;

  const user = await db.collection('users').findOne({ email });
  if (user.confirmationToken === token) {
    await db
      .collection('users')
      .findOneAndUpdate(
        { email },
        { $set: { confirmed: true } },
        (err, doc) => {
          if (err) {
            console.log('Something wrong when updating data!');
          }

          console.log(doc);
        },
      );
    return res.status(200).send(`${user.email} confirmed successfully`);
  }

  return res.status(400).json({
    error: 'Token does not match',
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
    text: `You are receiving this because you (or someone else) have registered on our site (thanks for helping us out!) \n\n Please click on the following link, or paste this into your browser to complete the process \n\n ${
      process.env.REACT_APP_API_URL
    }/success-email/${email}/${token}`,
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
  });
};

AuthController.resetPassword = async (req, res) => {
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
      { $set: { confirmationPasswordToken: token } },
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
    subject: 'Reset Password Chingu Bears-08',
    text: `You are receiving this because you (or someone else) have requested a password reset on our site \n\n Please click on the following link, or paste this into your browser to complete the process \n\n ${
      process.env.REACT_APP_API_URL
    }/change-password/${email}/${token}`,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SERVICE_EMAIL,
      pass: process.env.SERVICE_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error(err);
      return response.status(500);
    }
    return res.status(200).json('Confirmation email sent');
  });
};

AuthController.changePassword = async (req, res) => {
  const {
    body: {
      user: { email, token, password },
    },
  } = req;

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await db.collection('users').findOne({ email });
  if (user.confirmationPasswordToken === token) {
    await db
      .collection('users')
      .findOneAndUpdate(
        { email },
        { $set: { password: hashedPass } },
        (err, doc) => {
          if (err) {
            console.log('Something wrong when updating data!');
          }

          console.log(doc);
        },
      );
    return res.status(200).send('Password updated successfully');
  }

  return res.status(400).json({
    error: 'Token does not match',
  });
};

module.exports = AuthController;
