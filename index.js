const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const { mongoDB, reactType, serverPort } = require('./config');
const db = require('./database');

const router = require('./api/routes');
// MODELS
require('./api/models');
require('./config/passport');

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
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

// DB

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`mongoDB ${mongoDB.type} connected`);
});

// ROUTES
app.use('/api', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, `client/${reactType}{/index.html`));
});

const port = process.env.PORT || serverPort;

app.listen(port, () => console.log(`App listening on port ${port}!`));
