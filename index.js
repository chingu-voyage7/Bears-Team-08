const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const config = require('./config');
const { reactType, serverPort, logFormat } = config;

const router = require('./api/routes');

// Passport already pre-configured
const passport = require('./config/passport');

const app = express();

// MIDDLEWARE
app.use(logger(logFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, `client/${reactType}`)));
// cookieSession config
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],
  }),
);

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// ROUTES
app.use('/api', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, `client/${reactType}{/index.html`));
});

const port = process.env.PORT || serverPort;

app.listen(port, () => console.log(`App listening on port ${port}!\n`));

// Exporting app to be able to require it in the tests
module.exports = app;
